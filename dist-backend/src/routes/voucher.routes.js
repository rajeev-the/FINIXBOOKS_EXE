import express from 'express';
const router = express.Router();
import { getVoucherType, getVoucher } from '../controllers/voucher.controller.js';

router.post('/', getVoucher);
router.post('/vouchers', getVoucher);
router.post('/voucher-type', getVoucherType);

export default router;

