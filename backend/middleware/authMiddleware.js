import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

    let token = req.headers.authorization?.split(" ")[1]; //transforma Authorization: Bearer TOKEN in ["Bearer", "TOKEN"] si ia elementul 2
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