import User from "../models/User.js";
import jwt from "jsonwebtoken";

//generare JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

//pt User
export const registerUser = async (req, res) => {
    const {fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const existingUser = await User.findOne({ where: {email} });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use"});
        }

    const user = await User.create({
        fullName,
        email,
        password,
    });

    res.status(201).json({
        id: user.id,
        user,
        token: generateToken(user.id),
    });

    } catch (err) {
        res
            .status(500)
            .json({ message: "Error registering user", error: err.message });
    }

    User.sync({ force: false});
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    try {

        const user = await User.findOne({ where: {email} });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        res.status(200).json({
            id: user.id,
            user,
            token: generateToken(user.id),
        });

    } catch (err) {
        res 
            .status(500)
            .json({message: "Error login user", error: err.message});
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: {exclude: ["password"]}});

        if (!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (err){
        res
            .status(500)
            .json({ message: "Error founding the user", error: err.message});
    }
};