import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TransactionFilter = ({
  filterMonth,
  setFilterMonth,
  filterAmountMin,
  setFilterAmountMin,
  filterAmountMax,
  setFilterAmountMax,
  onReset
}) => (
  <div className="flex gap-4 mb-4">
    <DatePicker
    selected={filterMonth}
    onChange={date => setFilterMonth(date)}
    dateFormat="MM/yyyy"
    showMonthYearPicker
    placeholderText="Month"
    className="border rounded px-2 py-1"
  />
    <input
      type="number"
      placeholder="Min value"
      value={filterAmountMin}
      onChange={e => setFilterAmountMin(e.target.value)}
      className="border rounded px-2 py-1"
    />
    <input
      type="number"
      placeholder="Max value"
      value={filterAmountMax}
      onChange={e => setFilterAmountMax(e.target.value)}
      className="border rounded px-2 py-1"
    />
    <button
      onClick={onReset}
      className="px-3 py-1 bg-gray-200 rounded"
    >
      Reset
    </button>
  </div>
);

export default TransactionFilter;