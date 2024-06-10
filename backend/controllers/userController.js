import User from '../models/userModels.js';
import { Copy } from '../models/copyModel.js';

export const getUser = async(req, res) =>{
    try{
        const _id = req._id;
        const user = await User.findById(_id).populate({path:'cart.copyId', model:'Copy', populate: {path:'bookId', model:'Book'}});
        if(!user) {
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

export const getAdmin = async(req, res) =>{
    try{
        const user = await User.find({
            $or: [
                { 'roles.Admin': {$exists: true, $ne: null}},
                { 'roles.SuperAdmin': {$exists: true, $ne: null}}
            ]
        });

        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const getCart = async(req, res) =>{
    try{
        const _id = req._id;
        const user = await User.findById(_id).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});
        if(!user) {
            throw new Error('User not found');
        }
        res.status(200).json(user.cart);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const addItemToCart = async(req, res) => {
    try{
        const{copyId, quantity} = req.body;
        const _id = req._id;
        const book = await Copy.findById(copyId);
        const user = await User.findById(_id);
        if(!user) {
            throw new Error('User not found');
        }

        const existItemCart = user.cart.findIndex(item => item.copyId.equals(copyId));
        if(existItemCart !== -1){
            user.cart[existItemCart].quantity += quantity;
        }else{
            user.cart.push({copyId: copyId, quantity: quantity});
        }
        await user.save();
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteItemToCart = async(req, res) =>{
    try{
        const {copyId} = req.body;
        const _id = req._id;
        const user = await User.findById(_id).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});

        user.cart = user.cart.filter(item => !item.copyId.equals(copyId));
        await user.save({new:true});
        res.status(200).json(user.cart);
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const updateQuantityItemInCart = async(req, res) =>{
    try{
        const{copyId, quantity} = req.body;
        const _id = req._id;
        const book = await Copy.findById(copyId);
        const user = await User.findById(_id).populate({path:'cart.copyId', model:'Copy', populate:[ {path:'bookId', model:'Book'}, {path:'discount', model: 'DiscountBook'}]});
        if(!user) {
            throw new Error('User not found');
        }

        const itemCart = user.cart.find(item => item.copyId.equals(copyId));
        if(!itemCart){
            throw new Error('Item not found in Cart');
        }

        itemCart.quantity = quantity;
        await user.save({new: true});
        console.log(user.cart);
        res.status(200).json(user.cart);

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const createNewAddress = async(req, res) =>{
    try{
        const{name, phoneNumber,  address, ward, district, city} = req.body;
        const _id = req._id;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error('User not found');
        }
        const diachi= new Object();

        diachi.name = name;
        diachi.phoneNumber= phoneNumber;
        diachi.address= address;
        diachi.ward= ward;
        diachi.district= district;
        diachi.city = city;
        user.address = diachi;
        await user.save();
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const updateAddress = async(req, res) =>{
    try{
        const{addressId,name,phoneNumber, address, ward, district, city} = req.body;
        const _id = req._id;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error('User not found');
        }
        const addr = user.address.find(addr => addr._id.equals(addressId));
        if(!addr){
            throw new Error('Address is not exist');
        }
        addr.name = name;
        addr.phoneNumber = phoneNumber;
        addr.address = address;
        addr.ward = ward;
        addr.district = district;
        addr.city = city;

        await user.save();
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteAddress = async(req,res) =>{
    try{
        const{addressId} = req.body;
        const _id = req._id;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error('User not found');
        }

        user.address  = user.address.filter(addr => !addr._id.equals(addressId));
        await user.save();
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getAddress = async(req, res) =>{
    try{
        const _id = req._id;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error('User not found');
        }

        res.status(200).json(user.address);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}