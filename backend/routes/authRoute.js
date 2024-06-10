import express from 'express';
import {
    signupUser,
    loginUser,
    handleRefreshTokenUser,
    logoutUser,
    signupAdmin,
} from '../controllers/authController.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';
import { requiredAuth } from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/refresh', handleRefreshTokenUser);
router.get('/logout', logoutUser);

router.post('/signupAdmin',requiredAuth, verifyRoles(ROLE_LIST.SUPERADMIN), signupAdmin);

export default router;