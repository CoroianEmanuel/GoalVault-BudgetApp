import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

    let token = req.headers.authorization?.split(" ")[1]; //transforma Authorization: Bearer TOKEN_AICI in ["Bearer", "TOKEN_AICI"] si ia elementul 2
    // 'authorization?' este optional chaining care returneaza undefined daca token nu exista
    if (!token) {
        return res.status(401).json({ message: "No authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id, { attributes: {exclude: ["password"]}});
        next();
    } catch (err) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};