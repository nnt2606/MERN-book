import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/config.js';

export const requiredAuth = async (req,res, next) =>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')) {
        return res.status(401).json("No Bearer");
    }
    const token = authHeader.split(' ')[1];
    try{
        jwt.verify(
            token, 
            ACCESS_TOKEN_SECRET,
            (err, decoded) =>{
                if(err){ 
                    console.log("error");
                    return res.status(401).json({err: err.message});//forbidden
                }
                req._id = decoded.UserInfor._id;
                req.roles = decoded.UserInfor.roles;
                next();
             }
        );
    }catch(error){
        console.log("error");
        res.status(401).json({error: error.message});
    }
}

