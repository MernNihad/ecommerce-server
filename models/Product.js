import mongoose,{Schema} from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageLink:{
        type:String,
        required:true
    }
})

export const ProductModel = mongoose.model('product',productSchema)
