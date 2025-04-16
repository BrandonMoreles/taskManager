import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js";
import authenticate from "../middleware/authenticate.js";
const isProduction = process.env.NODE_ENV === "production";


//se le asigna a una constante para mejor control
const router = express.Router();
//Este router crea un usuario
router.post("/register", async(req, res)=>{
    const {username, email, password}=req.body;
    try{
        //se verifica si el usuario ya existe
        const userExist= await User.findOne({email});
        //si existe sale del proceso y manda mensaje de error
        if (userExist) return res.status(400).json({message:"Usuario ya registrado"})
        //si no existe, continua y genera un nuevo user
        const newUser= new User({username, email, password})
        //Guarda el usuario
        await newUser.save();
        //se genera un token con json web token (jwt) 
        // y se firma (sign) que es basicamente darle las credenciales
        const token=jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"})
        //Despues se devuelve en la respuesta
        //201 indica que la solucitud fue exisotsa y se creo un nuevo recurso
        res.status(200).cookie("token", token,{
            httpOnly:false,
            secure:false,
            sameSite:"Lax",
            maxAge:7*24*60*60*1000
        })
    }
    catch(error){
        //en caso de haber un error el programa lo manda
        //en este caso el 500 que indica un error inesperado y no se pudo completar la solicitud
        res.status(500).json({message:error.message})
     }

})

router.post("/login", async (req, res) => {
    // La desestructuración nos permite sacar los valores de las claves
    // de un objeto y asignarlas a una constante con el nombre de la clave
    // todo en una sola línea de código
    const { email, password } = req.body;

    try {
        // Se busca al usuario y se verifica si existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparamos la contraseña ingresada con la almacenada en la base de datos
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Se genera el token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Establecemos la cookie con el token
        res.status(200).cookie("token", token, {
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // Corregido el valor de maxAge
        });

        // Respondemos al cliente con un mensaje de éxito
        return res.json({ message: "Inicio de sesión exitoso" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
});


router.post("/logout", (req,res)=>{
    res.clearCookie('token', {
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax"
    })
    res.json({message:"Sesion cerrada"})
})


router.get("/", authenticate, async (req, res)=>{
    try{
        const user=await User.findById(req.user.id).select("username")
        res.json({user})
    }
    catch(error){
        return res.status(500).json({message:"Error al obtener el perfil"})
    }
})

export default router
