import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const RecentIncome = ({transactions, onSeeMore}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income</h5>

                <button className="card-btn" onClick={onSeeMore}>
                    Sell All <LuArrowRight className="text-base" />
                </button>
            </div>
        
            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((item) => ( // "map()" face pentru fiecare tranzacție, creează un card TransactionInfoCard.
                    <TransactionInfoCard
                        key={item.id}
                        title={item.category}
                        icon={item.icon}
                        date={moment(item.date).format("Do MMM YYYY")} // "moment.js "e folosit pentru a formata data tranzacției într-un mod mai ușor de citit.
                        amount={item.amount}
                        type="income"
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    );
}

export default RecentIncome