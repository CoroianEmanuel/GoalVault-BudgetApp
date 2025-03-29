import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { Op, fn, col } from "sequelize";

export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        //calcul total venituri
        const totalIncome = await Income.findOne({
             attributes: [[fn("SUM", col("amount")), "total"]],
             where: {userId}
        });

        const totalIncomeValue = totalIncome?.get("total") || 0;

        const totalExpense = await Expense.findOne({
            attributes: [[fn("SUM", col("amount")), "total"]],
            where: {userId}
        });

        const totalExpenseValue = totalExpense?.get("total") || 0;

        const last60DaysIncomeTransactions = await Income.findAll({
            where: {
                userId,
                date: {
                    [Op.gte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) //cu 60 de zile in urma
                    //Op.gte = mai mare sau egal decat
                }
            },
            order: [["date", "DESC"]]
        });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0);

        const last30DaysExpenseTransactions = await Expense.findAll({
            where: {
                userId,
                date: {
                    [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }, 
        });

        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0);

        const lastTransactions = [
            ...(await Income.findAll({
            // "..." = spread operator -> imprastie elementele unui array sau proprietatile unui obiect
                where: {userId},
                order: [["date", "DESC"]],
                limit: 5,
            })).map(transact => ({
                ...transact.get({ plain: true}),
                type: "income", //convertire in obiect simplu
            })),

            ...(await Expense.findAll({
                where: {userId},
                order: [["date", "DESC"]],
                limit: 5,
            })).map(transact => ({
                ...transact.get({ plain: true}),
                type: "expense",
            }))
        ].sort((a, b) => b.date - a.date); //sorteaza tot dupa data

        console.log(lastTransactions);

        res.json({
            totalBalance: totalIncomeValue - totalExpenseValue,
            totalIncome: totalIncomeValue,
            totalExpense: totalExpenseValue,
            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};