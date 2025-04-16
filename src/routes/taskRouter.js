import express from "express"
import authenticate from "../middleware/authenticate.js"
import Task from "../models/Task.js"
const router = express.Router()

router.post("/", authenticate, async(req, res)=>{
    const {title, description}=req.body
    try{
        const newTask= new Task({
            title,
            description,
            user:req.user.id
        })
        await newTask.save()
        res.status(201).json(newTask);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

router.get("/", authenticate, async(req,res)=>{
    try{
        const tasks=await Task.find({user:req.userId});
        res.json(tasks);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.put("/:id", authenticate, async(req, res)=>{
    try{
        const updateTask= await Task.findByIdAndUpdate({
            _id:req.params.id, user:req.userId
        },req.body,
    {new:true}
    )
    if(!updateTask)return res.status(404).json({message:"Tarea no encontrada"})
    res.json(updateTask);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

router.delete("/:id", authenticate, async (req, res) => {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  
      if (!deletedTask) return res.status(404).json({ message: "Tarea no encontrada o no autorizada" });
  
      res.json({ message: "Tarea eliminada con éxito" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export default router;