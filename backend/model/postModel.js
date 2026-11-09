import mongoose from "mongoose"

const replySchema=new mongoose.Schema({
author:{
        type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    message:{
        type:String
    },
    
    createdAt:{type:Date,default:Date.now},
    updateAt:{type:Date}
},{_id:true})

const commentSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    },
    message:{
        type:String
    },
    replies:{replySchema},
    createdAt:{type:Date,default:Date.now},
    updateAt:{type:Date}

},{_id:true})
const postSchema=new mongoose.Schema({
channel:{
    type:mongoose.Schema.Types.ObjectId,
        ref:"Channel",
        required:true
},
content:{
    type:String,
    required:true
},
image:{
 type:String,
},
likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}],

comments:{commentSchema}
},{timestamps:true})

const post= mongoose.model("post",postSchema)

export default post