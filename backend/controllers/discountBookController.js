import { convertTime } from "../config/changeTime.js";
import logActivity from "../config/logger.js";
import { DiscountBook } from "../models/discountBookModel.js";

export const createDiscount = async(req, res) =>{
    try{
        const {discountNumber, startAt, endAt, status} = req.body;
        const startAtDate = new Date(startAt);
        const endAtDate = new Date(endAt);
        if (isNaN(startAtDate) || isNaN(endAtDate)) {
          return res.status(400).json({ error: 'Invalid date' });
        }
        const newDiscount = new DiscountBook({discountNumber, startAt: startAtDate, endAt: endAtDate, status});
        const discount = await newDiscount.save();
        await logActivity(req._id, 'CREATE NEW DISCOUNT', discount._id, 'Discount', discount);
        res.status(200).json(discount);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getAllDiscount = async(req, res) =>{
    try{
        const discount = await DiscountBook.find({});
        const discountWithGmt7 = discount.map((item)=>({
            ...item._doc,
            startAt: convertTime(item.startAt),
            endAt: convertTime(item.endAt)
        }))
        res.status(200).json(discountWithGmt7);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getAvailableDiscount = async(req, res) =>{
    try{
        const discount = await DiscountBook.find({status: true});
        res.status(200).json(discount);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getDiscount = async(req, res) =>{
    try{
        const {_id} = req.body;
        const discount = await DiscountBook.findById(_id);
        if(!discount){
            return res.status(400).json({message: 'Discount is not exist'});
        }
        res.status(200).json(discount);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const deleteDiscount = async(req, res) =>{
    try{
        const {_id} = req.body;
        const deleteDiscount = await DiscountBook.findByIdAndDelete(_id);
        if(!deleteDiscount){
            return res.status(400).json({message: 'Discount is not exist'});
        }
        await logActivity(req._id, 'DELETE DISCOUNT', _id, 'Discount', deleteDiscount);
        res.status(200).json(deleteDiscount);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const updateDiscount = async(req,res) =>{
    try{
        const {_id,discountNumber, startAt, endAt, status} = req.body;
        const startAtDate = new Date(startAt);
        const endAtDate = new Date(endAt);
        const updatedDiscount = await DiscountBook.findByIdAndUpdate(
            _id,
            {discountNumber, startAt:startAtDate, endAt:endAtDate, status}
        );
        if(!updatedDiscount){
            return res.status(400).json({message: 'Discount is not exist'});
        }
        await logActivity(req._id, 'UPDATE DISCOUNT', _id, 'Discount', updatedDiscount);
        res.status(200).json(updatedDiscount);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}