import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const cartSchema = new mongoose.Schema(
    {
        copyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Copy',
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        }
    }
)
const addressSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        ward: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        name: {
            type:String,
            required: true,
        },
        phoneNumber: {
            type:Number,
            required: true,
        }
    }
)
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        cart: {
            type: [cartSchema],
        },
        address: {
            type: addressSchema,
        },
        refreshToken: {
            type: String,
        },
        roles:{
            User: {
                type: Number,
                default: 2001,
            },
            Admin: {
                type: Number,
            },
            SuperAdmin: {
                type: Number,
            }
        }
    },
    {
        timestamps: true
    }
)

userSchema.statics.signup = async function(name, email, password, roles) {
    if(!email || !password){
        throw Error('All field must be filled')
    }

    const exists = await this.findOne({email});
    if(exists) {
        throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new this({name, email, password: hash });
    // console.log(roles);
    if(roles!==null){
        if(roles.includes('admin')){
            user.roles.Admin = 1984;
        }
        if(roles.includes('superadmin')){
            user.roles.SuperAdmin = 5150;
        }
    }
    user.roles.User = 2001;
    await user.save();
    return user;
};

userSchema.statics.login = async function(email, password) {
    if(!email || !password){
        throw Error('All field must be filled')
    }
    
    const user = await this.findOne({email});
    if(!user){
        throw Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
        throw Error('Incorrect email or password');
    }
    
    return user;
}

const User = mongoose.model('User', userSchema);
export default User;