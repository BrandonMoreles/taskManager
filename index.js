import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRouter.js"
import taskRoutes from "./src/routes/taskRouter.js"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cookieParser());
// Middleware
app.use(cors({
  credentials: true,
  origin: "http://192.168.31.115:5173/"
  }
));

app.use(express.json()); // Para recibir JSON en las peticiones

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Conectado a MongoDB"))
  .catch((err) => console.error(err));

// Rutas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => console.log(`🔥 Servidor en http://localhost:${PORT}`));
