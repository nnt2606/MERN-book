import express from 'express';
import{
    createDiscount,
    deleteDiscount,
    getAllDiscount,
    getDiscount,
    updateDiscount
}from '../controllers/discountBookController.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';

const router = express.Router();

router.post('/createDiscount', verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), createDiscount);
router.post('/getAllDiscount',verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), getAllDiscount);
router.post('/deleteDiscount', verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), deleteDiscount);
router.post('/updateDiscount', verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), updateDiscount);
router.post('/getDiscount', getDiscount);

export default router;