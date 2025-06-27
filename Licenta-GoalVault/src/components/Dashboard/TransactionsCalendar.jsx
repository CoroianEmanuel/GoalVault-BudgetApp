import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import moment from "moment";

const TransactionsCalendar = ({ transactions }) => {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => { //ruleaza de fiecare data cand se schimba una din proprietatile setate la final, ex: calendarDate
    const selectedDate = moment(calendarDate).format("YYYY-MM-DD");

    const filtered = transactions.filter(t => 
        moment(t.date).format("YYYY-MM-DD") === selectedDate
      );
      

    setFilteredTransactions(filtered); 
  }, [calendarDate, transactions]);

  return (
    <div className="card p-6">
        <h3 className="text-lg mb-4">Transaction Calendar</h3>

        <div className="flex justify-center">
            <Calendar 
                onChange={setCalendarDate}
                value={calendarDate}
                className="rounded-lg shadow border-none w-full mb-6"
            />
        </div>
       <h4 className="text-base font-medium mb-2 text-center">
            Transactions on {moment(calendarDate).format("DD MMMM YYYY")}
       </h4>

       {filteredTransactions.length === 0 ? (
            <p className="text-sm text-muted text-center">No transactions on this day.</p>
       ) : (
            <ul className="space-y-2">
                {filteredTransactions.map((t) => (
                    <li key={t.id} className="p-3 bg-gray-100 rounded-md">
                        <div className="flex justify-between items-center">
                            <span>{t.category}</span>
                            <span className={`font-semibold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                                {t.type === "income" ? "+" : "-"}${t.amount}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
       )}
    </div>
  );
};

export default TransactionsCalendar;
