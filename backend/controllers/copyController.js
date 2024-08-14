import {Copy} from '../models/copyModel.js';
import {Book} from '../models/booksModel.js';
import logActivity from '../config/logger.js';
import mongoose from 'mongoose';

export const getCopyByBookId = async(req, res) =>{
    try{
        const {bookId} = req.body;
        const copy = await Copy.findOne({bookId: bookId}).populate({path:'bookId', model:'Book'}).populate({path: 'discount',model: 'DiscountBook'});
        if(!copy){
            return res.status(404).json({message: 'Copy of this book not found'});
        }
        res.status(200).json(copy);
    }catch(error) {
        res.status(408).json({message: error.message})
    }
}

export const getListCopy = async(req, res) =>{
    const {sort} = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const getSortStage = (criteria) => {
        switch (criteria) {
          case 'new':
            return { createdAt: -1 }; // Newest createdAt first
          case 'best':
            return { sold: -1 }; // Best seller (highest sold) first
          case 'low':
            return { price: 1 }; // Low to high price
          case 'high':
            return { price: -1 }; // High to low price
          case 'stock':
            return {inStock: 1}
          default:
            return {createdAt: -1}; 
        }
      };
    
    const sortStage = getSortStage(sort);

    try{
        // const listCopy = await Copy.find().skip(startIndex).limit(limit).populate({path:'bookId', model:'Book'}).populate({path: 'discount',model: 'DiscountBook'}).sort(sortStage);
        const aggregationPipeline = [
          {
            $lookup: {
              from: 'books',
              localField: 'bookId',
              foreignField: '_id',
              as: 'bookId'
            }
          },
          { $unwind: '$bookId' },
          // {
          //   $lookup: {
          //     from: 'discountbooks',
          //     localField: 'discount',
          //     foreignField: '_id',
          //     as: 'discount'
          //   }
          // },
          // {$unwind: {
          //   path: '$discount',
          //   preserveNullAndEmptyArrays: true 
          // }},
          {
            $project: {
              _id: 1,
              price: 1,
              inStock: 1,
              imgURL: 1,
              sold: 1,
              'bookId._id': 1,
              'bookId.title': 1,
              'bookId.genre': 1,
              'bookId.authors': 1,
              discount: 1
            }
          },
          { $sort: sortStage},
          { $facet: {
              paginatedResult: [
                { $skip: startIndex },
                { $limit: parseInt(limit) }
              ],
              totalCount: [
                { $count: 'total' }
              ]
            }
          }
        ];

        const result = await Copy.aggregate(aggregationPipeline);

        const totalItems = await Copy.countDocuments();
        res.status(200).json({
            listCopy: result[0].paginatedResult,
            limits: limit,
            totalRecords: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
          });
    }catch(error) {
        res.status(408).json({message: error.message})
    }
}

export const search = async(req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const{searchValue, selectValue, minPrice, maxPrice, sort} = req.body;    
    const startIndex = (page - 1) * limit;

    const getSortStage = (criteria) => {
        switch (criteria) {
          case 'new':
            return { createdAt: -1 }; // Newest createdAt first
          case 'best':
            return { sold: -1 }; // Best seller (highest sold) first
          case 'low':
            return { price: 1 }; // Low to high price
          case 'high':
            return { price: -1 }; // High to low price
          case 'stock':
            return {inStock: 1}
          default:
            return { createdAt: -1 }; // No sorting if criteria is not recognized
        }
      };
    
    const sortStage = getSortStage(sort);

    console.log(req.body);
    
    try{
        const bookMatchConditions = [];
        if (searchValue) {
          bookMatchConditions.push({ 'bookId.title': { $regex: searchValue, $options: 'i' } });
        }
        if (selectValue && selectValue.length > 0) {
          bookMatchConditions.push({ 'bookId.genre': { $all: selectValue } });
        }
    
        const copyMatchConditions = {};
        if (minPrice) {
            copyMatchConditions.price = { $gte: minPrice };
        }
        if (maxPrice) {
            copyMatchConditions.price = { ...copyMatchConditions.price, $lte: maxPrice };
        }
                
        const aggregationPipeline = [
            {
              $lookup: {
                from: 'books',
                localField: 'bookId',
                foreignField: '_id',
                as: 'bookId'
              }
            },
            { $unwind: '$bookId' },
            ...(bookMatchConditions.length ? [{ $match: { $and: bookMatchConditions } }] : []),
            { $match: copyMatchConditions },
            {
              $project: {
                _id: 1,
                price: 1,
                inStock: 1,
                imgURL: 1,
                sold: 1,
                'bookId._id': 1,
                'bookId.title': 1,
                'bookId.genre': 1,
                'bookId.authors': 1,
              }
            },
            { $sort: sortStage},
            { $facet: {
                paginatedResult: [
                  { $skip: startIndex },
                  { $limit: parseInt(limit) }
                ],
                totalCount: [
                  { $count: 'total' }
                ]
              }
            }
          ];

          const result = await Copy.aggregate(aggregationPipeline);
      
        const totalItems = result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0

        res.status(200).json({
            listCopy: result[0].paginatedResult,
            limits: limit,
            totalRecords: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
          });
        
    }catch(error){
        res.status(408).json({error: error.message})
    }

}

export const wasSell = async (req, res) =>{
    try{
        const aggregationPipeline = [
          {
            $lookup: {
              from: 'books',
              localField: 'bookId',
              foreignField: '_id',
              as: 'bookId'
            }
          },
          { $unwind: '$bookId' },
          {
            $project: {
              _id: 1,
              price: 1,
              inStock: 1,
              imgURL: 1,
              sold: 1,
              'bookId._id': 1,
              'bookId.title': 1,
              'bookId.genre': 1,
              'bookId.authors': 1,
              updatedAt: 1,
            }
          },
          {$sort: {updatedAt: -1}},
          {$limit: 8}
        ]

        const result = await Copy.aggregate(aggregationPipeline);

        res.status(200).json(result);
    }catch(error){
        res.status(408).json({error: error.message})
    }
}


export const createCopy = async(req,res) =>{
    try{
        const {ISBN, bookId, pages, format, language, publishYear, Publisher, inStock, price, discount, description} = req.body;
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({message: 'Book is not exist'});
        }
        const newCopy = new Copy({ISBN, bookId, pages, format, language, publishYear, Publisher, inStock, price, discount})
        const savedCopy = await newCopy.save();
        await logActivity(req._id,'CREATE NEW COPY', newCopy._id, 'Copy', newCopy);
        res.status(200).json(savedCopy);
    }catch(error) {
        res.status(408).json({message: error.message});
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
        res.status(408).json({message: error.message});
    }
}

export const updateCopy = async(req,res) =>{
    try{
        const {ISBN,bookId, pages, format, language, publishYear, Publisher, inStock, price, sold, discount, description} = req.body;
        const updatedCopy = await Copy.findOneAndUpdate(
            {bookId: bookId},
            {ISBN, pages, format, language, publishYear, Publisher, inStock, price, sold, discount, description}
        );
        if(!updatedCopy){
            return res.status(404).json({message: 'Copy not found'});
        }
        await logActivity(req._id,'UPDATE COPY', updatedCopy._id, 'Copy', updatedCopy);
        res.status(200).json(updatedCopy);
    }catch(error){
        res.status(408).json({message: error.message})
    }
}

export const addDiscount = async(req, res) =>{
  try{
    const {discountId, copyId}=req.body;
    const processDiscount = copyId.map(async(item) =>{
      const copy = await Copy.findById(item);
      copy.discount = discountId;
      await copy.save();
    })
    await Promise.all(processDiscount);
    res.sendStatus(200);
  }catch(error){
        res.status(408).json({message: error.message})
    }
}


