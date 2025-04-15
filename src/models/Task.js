import mongoose, { mongo } from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
//los timpestamps agruegan automaticamente a cada tarea 
// le fecha de creacion y modificacion
{timestamps:true})

const Task=mongoose.model("Task", taskSchema);
export default Task;