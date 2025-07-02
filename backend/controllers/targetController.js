import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { Op } from "sequelize";

export const setExpenseTarget = async (req, res) => {
    const userId = req.user.id;
    const {target} = req.body;

    try {
        const user = await User.findByPk(userId);
        user.expenseTarget = target;
        await user.save();

        res.json({ message: "Target set successfully", target });
    } catch (err) {
        res.status(500).json({ message: "Failed to set target" });
    }
};

export const getMonthlyExpenseSummary = async (req, res) => {
    const userId = req.user.id;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    try {
        const total = await Expense.sum("amount", {
            where: {
                userId,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
        });
    
        const user = await User.findByPk(userId);

        res.json({
            target: user.expenseTarget,
            totalSpent: total || 0,
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching expense summary" });
    }


};

