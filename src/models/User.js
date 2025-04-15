import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true, 
        match:[/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/, "Por favor ingresa un email válido"]
    },
    password:{
        type:String,
        required:true,
        minlenght:6
    }
})

//middleware para hashear (encriptar)
//  el password antes de guardarlo
userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword=async function(password) {
    return bcrypt.compare(password, this.password)
}

const User=mongoose.model("User",userSchema);
export default User;