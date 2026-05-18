"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeads = exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeads = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const getLeads = async (req, res) => {
    try {
        const { status, source, search, sort, page = 1 } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (source)
            query.source = source;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const limit = 10;
        const skip = (Number(page) - 1) * limit;
        const total = await Lead_1.default.countDocuments(query);
        const leads = await Lead_1.default.find(query)
            .sort(sort === 'oldest' ? 'createdAt' : '-createdAt')
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email');
        res.status(200).json({ data: leads, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getLeads = getLeads;
const createLead = async (req, res) => {
    try {
        const { name, email, status, source } = req.body;
        const lead = await Lead_1.default.create({ name, email, status: status || 'New', source, createdBy: req.user?.id });
        res.status(201).json(lead);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createLead = createLead;
const updateLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lead) {
            res.status(404).json({ message: 'Lead not found' });
            return;
        }
        res.status(200).json(lead);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findByIdAndDelete(req.params.id);
        if (!lead) {
            res.status(404).json({ message: 'Lead not found' });
            return;
        }
        res.status(200).json({ message: 'Lead deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteLead = deleteLead;
const exportLeads = async (req, res) => {
    try {
        const leads = await Lead_1.default.find().populate('createdBy', 'name email');
        const csv = [
            ['Name', 'Email', 'Status', 'Source', 'Created At'],
            ...leads.map(lead => [lead.name, lead.email, lead.status, lead.source, lead.createdAt.toISOString()])
        ].map(row => row.join(',')).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.exportLeads = exportLeads;
