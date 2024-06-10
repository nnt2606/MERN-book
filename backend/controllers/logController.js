import Log from "../models/logModel";

export const viewAllLog = async(req, res) =>{
    try {
        const log = await Log.find();
        res.status(200).json(log);
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