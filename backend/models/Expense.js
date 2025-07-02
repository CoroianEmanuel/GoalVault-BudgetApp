import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Expense = sequelize.define("Expense", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    icon: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: "Expense",
});

//relatiile
User.hasMany(Expense, {foreignKey: "userId", onDelete: "CASCADE" });
Expense.belongsTo(User, {foreignKey: "userId" });

export default Expense