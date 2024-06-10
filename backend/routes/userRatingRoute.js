import express from 'express';
import { 
    createNewRating, 
    getRatingByBook,
    getRatingByUser
} from '../controllers/userRatingController.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';
import { requiredAuth } from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/getRByBook', getRatingByBook);
router.post('/createRating',requiredAuth, verifyRoles(ROLE_LIST.USER, ROLE_LIST.SUPERADMIN), createNewRating);

router.post('/getRByUser',requiredAuth, verifyRoles(ROLE_LIST.USER, ROLE_LIST.SUPERADMIN), getRatingByUser);

export default router;