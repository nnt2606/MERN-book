import express from 'express';
import { 
    createOrder, 
    deleteOrderByAdmin, 
    deleteOrderByUser, 
    finishOrderByUser, 
    getOrderByAdmin, 
    getOrderByUser, 
    getOrderDetails,
    updateOrderDeliveryByAdmin
} from '../controllers/orderController.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import ROLE_LIST from '../config/role.js';

const router = express.Router();

router.post('/createOrder', createOrder);

router.post('/getOrderDetails', getOrderDetails);
router.post('/getOrderByUser', getOrderByUser);
router.post('/getOrderByAdmin', verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), getOrderByAdmin);

router.post('/cancelOrder',verifyRoles(ROLE_LIST.USER, ROLE_LIST.SUPERADMIN), deleteOrderByUser);
router.post('/finishOrder',verifyRoles(ROLE_LIST.USER, ROLE_LIST.SUPERADMIN), finishOrderByUser);

router.post('/deliveryUpdate', verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), updateOrderDeliveryByAdmin);
router.post('/acceptCancel', verifyRoles(ROLE_LIST.ADMIN, ROLE_LIST.SUPERADMIN), deleteOrderByAdmin);

export default router;