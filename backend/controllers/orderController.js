import  {Order}  from "../models/orderModel.js";
import User from "../models/userModels.js";
import { Copy } from "../models/copyModel.js";
import logActivity from "../config/logger.js";

export const createOrder = async (req, res) =>{
    try{
        const {userNote, subtotal, discount, shippingcharge} = req.body;
        const userId = req._id;
        const user = await User.findById(userId);
        const order = new Order({
            userId, 
            userNote, 
            subtotal, 
            shippingcharge, 
            discount, 
            totalPayment: subtotal-discount+shippingcharge,
            address: {...user.address},
            cart: []
         });

         const processCartItems = user.cart.map(async (item) => {
            const copy = await Copy.findById(item.copyId);
            if (!copy) {
              throw new Error(`Copy with ID ${item.copyId} not found`);
            }
      
            if (copy.inStock >= item.quantity) {
              order.cart.push({ copyId: item.copyId, quantity: item.quantity });
              copy.inStock -= item.quantity;
              copy.onHold += item.quantity;
              await copy.save();
            } else {
              throw new Error(`The book with ID ${item.copyId} is not available`);
            }
          });

          await Promise.all(processCartItems);

        user.cart = [];
        await order.save({new:true});
        await logActivity(req._id, 'CREATE NEW ORDER', order._id, 'Order', order);
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getOrderDetails = async(req, res) =>{
    try{
        const {_id} = req.body;
        const order = await Order.findById(_id).populate({path:'userId', model:'User'}).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});
        if(!order){
            return res.status(400).json({message: 'Order not found'});
        }
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getOrderByUser = async(req, res) =>{
    try{
        const userId = req._id;
        const order = await Order.find({userId: userId}).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]}).sort({ createdAt: -1 })
        if(!order){
            return res.status(400).json({message: 'Order not found'});
        }
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getOrderByAdmin = async(req, res) =>{
    try{
        const order = await Order.find().populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]}).sort({ createdAt: -1 })
        if(!order){
            return res.status(400).json({message: 'Order not found'});
        }
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const updateOrderDeliveryByAdmin = async(req, res) =>{
    try{
        const{_id} = req.body;
        const order = await Order.findById(_id);
        order.status = 'On delivery';
        await order.save();
        await logActivity(req._id, 'UPDATE ORDER DELIVERY', order._id, 'Order', order.delivery);
        const orderResponse = await Order.find().populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]}).sort({ createdAt: -1 })
        res.status(200).json(orderResponse);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteOrderByUser = async(req, res) =>{
    try{
        const {_id, note} = req.body;
        const order = await Order.findById(_id).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});
        order.userNote.push(note);
        order.status = 'On waiting process';
        await order.save();
        await logActivity(req._id, 'CANCEL ORDER BY USER', order._id, 'Order', note);
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteOrderByAdmin = async(req, res) =>{
    try{
        const{_id, note} = req.body;
        const order = await Order.findById(_id);
        order.note = note;
        order.status = 'Cancel';
        order.available = false;
        for(const item of order.cart){
            const book = await Copy.findById(item.copyId);
            book.inStock += item.quantity;
            book.onHold -= item.quantity;
            await book.save({new: true});
        }
        order.save();
        await logActivity(req._id, 'CANCEL ORDER BY ADMIN', order._id, 'Order', note);
        const orderResponse = await Order.find().populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]}).sort({ createdAt: -1 })
        res.status(200).json(orderResponse);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const finishOrderByUser  = async(req, res) =>{
    try{
        const{_id} = req.body;
        const order = await Order.findById(_id).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});
        order.status = 'Done';
        order.available = false;
        for(const item of order.cart){
            const book = Copy.findById(item.copyId);
            book.inStock -= item.quantity;
            book.onHold -= item.quantity;
            book.sold += item.quantity;
            await book.save();
        }
        await order.save();
        await logActivity(req._id, 'FINISH ORDER', order._id, 'Order');
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

