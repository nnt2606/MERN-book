import mongoose, { Schema } from "mongoose";

const logSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  related: {
    Book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    Copy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Copy',
    },
    Order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    Rating:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRating',
    },
    Discount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount',
    }
  },
},{
  timestamps: true,
});

const Log = mongoose.model('Log', logSchema);
export default Log;