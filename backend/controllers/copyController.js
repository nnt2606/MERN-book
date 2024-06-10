import {Copy} from '../models/copyModel.js';
import {Book} from '../models/booksModel.js';
import logActivity from '../config/logger.js';

export const getCopyByBookId = async(req, res) =>{
    try{
        const {bookId} = req.body;
        const copy = await Copy.findOne({bookId: bookId}).populate({path:'bookId', model:'Book'}).populate({path: 'discount',model: 'DiscountBook'});
        if(!copy){
            return res.status(404).json({message: 'Copy of this book not found'});
        }
        res.status(200).json(copy);
    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

export const getListCopy = async(req, res) =>{
    try{
        const ListCopy = await Copy.find().populate({path:'bookId', model:'Book'}).populate({path: 'discount',model: 'DiscountBook'});
        res.status(200).json(copy);
    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

export const createCopy = async(req,res) =>{
    try{
        const {ISBN, bookId, pages, format, language, publishYear, Publisher, inStock, price, discount} = req.body;
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({message: 'Book is not exist'});
        }
        const newCopy = new Copy({ISBN, bookId, pages, format, language, publishYear, Publisher, inStock, price, discount})
        const savedCopy = await newCopy.save();
        await logActivity(req._id,'CREATE NEW COPY', newCopy._id, 'Copy', newCopy);
        res.status(200).json(savedCopy);
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteCopy = async(req,res) =>{
    try{
        const {bookId} = req.body;
        const deletedCopy = await Copy.findOneAndDelete({bookId: bookId});
        if(!deletedCopy){
            return res.status(400).json({error: 'Copy not found'});
        }
        await logActivity(req._id,'DELETE COPY', deletedCopy._id, 'Copy', deletedCopy);
        res.status(200).json({message: 'Copy deleted'});
    }catch(error) {
        res.status(500).json({message: error.message});
    }
}

export const updateCopy = async(req,res) =>{
    try{
        const {ISBN,bookId, pages, format, language, publishYear, Publisher, inStock, price, sold, discount} = req.body;
        const updatedCopy = await Copy.findOneAndUpdate(
            {bookId: bookId},
            {ISBN, pages, format, language, publishYear, Publisher, inStock, price, sold, discount}
        );
        if(!updatedCopy){
            return res.status(404).json({message: 'Copy not found'});
        }
        await logActivity(req._id,'UPDATE COPY', updatedCopy._id, 'Copy', updatedCopy);
        res.status(200).json(updatedCopy);
    }catch(error){
        res.status(500).json({message: error.message})
    }
}



