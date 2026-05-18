import { Router } from 'express';
import { getLeads, createLead, updateLead, deleteLead, exportLeads } from '../controllers/lead.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead);
router.get('/export', exportLeads);

export default router;