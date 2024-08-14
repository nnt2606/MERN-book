import express from 'express';
import {
    createBook, 
    deleteBook, 
    getAllGenres, 
    getBooks, 
    updateBook 
} from '../controllers/bookController.js';
import {requiredAuth} from '../middleware/verifyJWT.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';


const router = express.Router();

router.post('/getGenres', getAllGenres);
router.post('/getBook', getBooks);
router.post('/createBook',requiredAuth, verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), createBook)
router.post('/deleteBook',requiredAuth, verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), deleteBook);
router.post('/updateBook',requiredAuth,verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), updateBook);

export default router;