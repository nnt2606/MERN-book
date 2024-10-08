import express from 'express';
import{
    getCopyByBookId,
    createCopy,
    deleteCopy,
    updateCopy,
    getListCopy,
    search,
    wasSell,
    addDiscount
} from '../controllers/copyController.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';
import { requiredAuth } from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/getCopy', getCopyByBookId);
router.post('/getAllCopy', getListCopy);
router.post('/search', search);
router.post('/wasSell', wasSell);

router.post('/createCopy', requiredAuth, verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), createCopy);
router.post('/deleteCopy', requiredAuth, verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), deleteCopy);
router.post('/updateCopy', requiredAuth, verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN),  updateCopy);
router.post('/addDiscount', requiredAuth, verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), addDiscount);

export default router;