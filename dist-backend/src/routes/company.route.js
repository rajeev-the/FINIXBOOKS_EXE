import express from 'express';
const router = express.Router();
import { fetchTallyCompanies, fetchTallyCompaniesForTallyExeNoDataSave } from '../controllers/company.controller.js';
import { getTallyStatus } from '../controllers/tally.controller.js';

router.get('/status', getTallyStatus);
router.post('/', fetchTallyCompanies);
router.post('/show', fetchTallyCompaniesForTallyExeNoDataSave);

export default router;