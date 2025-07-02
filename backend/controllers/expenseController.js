import Expense from "../models/Expense.js";
import xlsx from "xlsx";

export const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date} = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const newExpense = await Expense.create({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        })

        res.status(200).json(newExpense);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message});
    }
};

export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.findAll({ where: {userId}, order: [["date", "DESC"]] });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteExpense = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
        const deleteRows = await Expense.destroy({
            where: {
                id: incomeId,
                userId: userId,
            }
        });
        
        if (deleteRows === 0) {
        return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        res.json({ message: "Income delete successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.findAll({ where: { userId }, order: [["date", "DESC"]] });
        

        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const updateExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { icon, category, amount, date } = req.body;

    try {
        const expense = await Expense.findOne({ where: { id: expenseId, userId } });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }
        expense.icon = icon;
        expense.category = category;
        expense.amount = amount;
        expense.date = new Date(date);
        await expense.save();
        res.json(expense);
    } catch (err) {
        console.error("Update expense error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};