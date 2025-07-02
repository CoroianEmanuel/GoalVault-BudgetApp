import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Income = sequelize.define("Income", {
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
    source: {
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
    tableName: "Income",
});

//relatiile
User.hasMany(Income, {foreignKey: "userId", onDelete: "CASCADE" });
Income.belongsTo(User, {foreignKey: "userId" });

export default Income