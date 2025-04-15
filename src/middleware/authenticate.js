import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    // Obtener el token de las cookies
    const token = req.cookies.token;
    // Verificar si el token existe
    if (!token) {
        return res.status(401).json({ message: "No autorizado, token faltante" });
    }

    try {
        // Verifica si el token es válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user= {id:decoded.id}; // Guardamos el ID del usuario para usarlo después
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

export default authenticate;
