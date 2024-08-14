import Log from "../models/logModel.js";

export const viewAllLog = async(req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    try {
        const log = await Log.find().skip(startIndex).limit(limit)
        .populate('user')
        .populate('related.Book')
        .populate('related.Copy')
        .populate('related.Order')
        .populate('related.Rating')
        .populate('related.Discount')
        .sort({createdAt: -1})
        .exec();
        const totalItems = await Log.countDocuments();
        res.status(200).json({
          log,
          totalPages: Math.ceil(totalItems/limit),
          currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs for user' });
    }
}

export const LogOfUser = async(req, res) => {
    try{
        const _id = req._id;
        const log = await log.find({user: _id});
        res.status(200).json(log);
    } catch( err){
        res.status(500).json({message: err.message});
    }
}

export const LogOtherUser = async(req, res) =>{
    try{
        const {userId} = req.body;
        const log = await log.find({user: userId});
        res.status(200).json(log);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export const findLog = async(req, res) =>{
    try{
        const {query, startDate, endDate} = req.body;
        let dateFilter = [];
        if (startDate && endDate) {
            dateFilter = {
              publishedDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            };
          } else if (startDate) {
            dateFilter = {
              publishedDate: {
                $gte: new Date(startDate)
              }
            };
          } else if (endDate) {
            dateFilter = {
              publishedDate: {
                $lte: new Date(endDate)
              }
            };
          }
        const log = await log.find({
            $and: [
                {action: {$regex: query, $option: 'i'}},
                dateFilter
            ]
        });
        res.status(200).json(log);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}