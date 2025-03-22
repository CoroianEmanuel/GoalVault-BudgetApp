import User from "../models/User.js";
import Income from "../models/Income.js";
import xlsx from "xlsx";

export const addIncome = async (req, res) => {
    const userId = req.user.id;

    try{ 
        const {icon, source, amount, date} = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const newIncome = await Income.create({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        // await newIncome.save();
        res.status(200).json(newIncome);

    } catch (err){
        console.error("Error adding income:", err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.findAll({ where: { userId }, order: [["date", "DESC"]] });
        res.json(income);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const deleteIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
        const deleteRows = await Income.destroy({
            where: {
                id: incomeId,
                userId: userId,
            }
        });

        if (deleteRows === 0) {
            return res.status(404).json({ message: "Income not found or unauthorized"});
        }

        res.json({ message: "Income deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.findAll({ where: { userId }, order: [["date", "DESC"]] });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (err){
        res.status(500).json({ message: "Server Error"});
    }
};