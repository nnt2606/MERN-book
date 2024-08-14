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

          user.cart = [];
          await user.save();

          await Promise.all(processCartItems);

        user.cart = [];
        await order.save({new:true});
        await logActivity(req._id, 'CREATE NEW ORDER', order._id, 'Order', order);
        res.status(200).json(order);
    }catch(error){
        res.status(408).json({message: error.message});
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
        res.status(408).json({message: error.message});
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
        res.status(408).json({message: error.message});
    }
}

export const getOrderByAdmin = async(req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    try{
        const order = await Order.find().skip(startIndex).limit(limit).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]}).sort({available: -1, createdAt: -1 })
        const totalItems = await Order.countDocuments();
        if(!order){
            return res.status(400).json({message: 'Order not found'});
        }
        res.status(200).json({
            order,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
          });
    }catch(error){
        res.status(408).json({message: error.message});
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
        res.status(408).json({message: error.message});
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
        res.status(408).json({message: error.message});
    }
}

export const deleteOrderByAdmin = async(req, res) =>{
    try{
        const{_id, note} = req.body;
        const order = await Order.findById(_id);
        order.note = note;
        order.status = 'Cancel';
        order.available = false;
        
        const processCartItems = order.cart.map(async(item) =>{
            const book = await Copy.findById(item.copyId);
            book.inStock += item.quantity;
            book.onHold -= item.quantity;
        })

        await Promise.all(processCartItems);
        order.save();
        await logActivity(req._id, 'CANCEL ORDER BY ADMIN', order._id, 'Order', note);
        const orderResponse = await Order.find().populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]}).sort({ createdAt: -1 })
        res.status(200).json(orderResponse);
    }catch(error){
        res.status(408).json({message: error.message});
    }
}

export const finishOrderByUser  = async(req, res) =>{
    try{
        const{_id} = req.body;
        const order = await Order.findById(_id).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});
        order.status = 'Done';
        order.available = false;
        const processCartItems = order.cart.map(async(item) =>{
            const book = Copy.findById(item.copyId);
            book.inStock -= item.quantity;
            book.onHold -= item.quantity;
            book.sold += item.quantity;
        })
       await Promise.all(processCartItems);
        await order.save();
        await logActivity(req._id, 'FINISH ORDER', order._id, 'Order');
        res.status(200).json(order);
    }catch(error){
        res.status(408).json({message: error.message});
    }
}

export const getStatistic = async(req, res) =>{
    try{
        const {month} = req.body;
        const now = new Date();
        const year = now.getFullYear();
        const startOfMonth = new Date(year, month-1, 1);
        const endOfMonth = new Date(year, month, 1);


        const pipeline = [{
            $match: {
                updatedAt: {
                    $gte: startOfMonth, // Assuming inputMonth is a valid date string or Date object
                    $lt: endOfMonth
                },
                status: 'Done' 
            },
        },
        // {
        //     $unwind: '$cart'
        // },
        {
            $group: {
                _id: null,
                totalPayment: { $sum: '$totalPayment' },
                totalProductSale: { $sum:{ $sum: '$cart.quantity' } },
                orders: { $push: '$$ROOT' } 
            }
        }
        ];
    const result = await Order.aggregate(pipeline);

    if(result.length > 0) {
        res.status(200).json({
            totalPayment: result[0].totalPayment,
            totalProductSale: result[0].totalProductSale,
            orders: result[0].orders
        })
    }else{
        res.status(200).json({
            totalPayment: 0,
            totalProductSale: 0
        })
    }



    }catch(error){
        res.status(408).json({message: error.message});
    }
}

