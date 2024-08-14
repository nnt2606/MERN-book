import User from '../models/userModels.js';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from '../config/config.js';

const accessToken = (_id, role) =>{
    return jwt.sign(
        {UserInfor: {
            _id: _id,
            roles: role,
        }}, 
        ACCESS_TOKEN_SECRET, 
        {expiresIn: '2h'});
}

const refreshToken = (_id, role) =>{
    return jwt.sign(
        {UserInfor: {
            _id: _id,
            roles: role,
        }}, 
        REFRESH_TOKEN_SECRET,
        {expiresIn: '3d'}
    )
}

export const signupUser = async(req, res) =>{
    const{name, email, password, roles} = req.body;
    console.log(email + " "+password);
    try{
        const user = await User.signup({name, email, password, roles});

        res.sendStatus(200);
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
}

export const signupAdmin = async(req, res) =>{
    const{name, email, password, roles} = req.body;
    console.log(name+" "+email+" "+password);
    try{
        const user = await User.signup({name, email, password, roles});

        const adminList = await User.find({
            $or: [
                { 'roles.Admin': {$exists: true, $ne: null}},
                { 'roles.SuperAdmin': {$exists: true, $ne: null}}
            ]
        });
        res.status(200).json(adminList);
    }catch(error){
        console.log(error);
        res.status(400).json(error.message);
    }
}


export const loginUser =  async(req, res) => {
    const{email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const roles = user.roles;
        const token = accessToken(user._id, user.roles);
        const rToken = refreshToken(user._id, user.roles);

        user.refreshToken = rToken;

        await user.save({new:true});


        res.cookie('jwt', rToken, {httpOnly: true, maxAge: 24*60*1000*3});//3day
        res.status(200).json({roles, token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}


export const handleRefreshTokenUser =  async(req, res) => {
    try{
        const cookie = req.cookies;
        if(!cookie?.jwt){
            return res.sendStatus(403);
        }
        const refreshToken = cookie.jwt;

        const user = await User.findOne({refreshToken: refreshToken});
        if(!user) return res.status(403)//forbidden

        jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET
        )
        const token = accessToken(user._id, user.roles);
        res.json({token});
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

export const logoutUser = async(req, res) =>{
    //delete accessToken of user
    const cookie = req.cookies;
    if(!cookie?.jwt){
        return res.status(204);//No content
    }
    const refreshToken = cookie.jwt;

    //check refreshToken in db
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user){ 
        res.clearCookie('jwt', {httpOnly: true});
        return res.status(403);//forbidden
    }

    //delete refreshToken in db
    user.refreshToken = '';
    await user.save();

    res.clearCookie('jwt', {httpOnly: true});
    res.sendStatus(204);
}