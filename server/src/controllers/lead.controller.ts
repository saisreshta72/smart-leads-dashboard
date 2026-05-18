import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page = 1 } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const limit = 10;
    const skip = (Number(page) - 1) * limit;
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sort === 'oldest' ? 'createdAt' : '-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.status(200).json({ data: leads, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;
    const lead = await Lead.create({ name, email, status: status || 'New', source, createdBy: req.user?.id });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) { res.status(404).json({ message: 'Lead not found' }); return; }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) { res.status(404).json({ message: 'Lead not found' }); return; }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find().populate('createdBy', 'name email');
    const csv = [
      ['Name', 'Email', 'Status', 'Source', 'Created At'],
      ...leads.map(lead => [lead.name, lead.email, lead.status, lead.source, lead.createdAt.toISOString()])
    ].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};