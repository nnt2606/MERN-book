import express from 'express';
import{
    addItemToCart,
    createNewAddress,
    deleteAddress,
    deleteItemToCart,
    getAddress,
    getAdmin,
    getCart,
    getUser,
    updateAddress,
    updateQuantityItemInCart
}from '../controllers/userController.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';

const router = express.Router();
``
router.post('/getUser', getUser);

router.post('/getCart', getCart);
router.post('/addCart', addItemToCart);
router.post('/updateCart', updateQuantityItemInCart);
router.post('/deleteCart', deleteItemToCart);

router.post('/getAddress', getAddress);
router.post('/addAddress', createNewAddress);
router.post('/updateAddress', updateAddress);
router.post('/deleteAddress', deleteAddress);

router.post('/getAdmin', verifyRoles(ROLE_LIST.SUPERADMIN), getAdmin)



export default router;