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
  <div className="card mb-4 p-4 rounded-2xl shadow-md border bg-white w-full">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
    <DatePicker
      popperPlacement="bottom-start"
      portalId="root"
      selected={filterMonth}
      onChange={date => setFilterMonth(date)}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      placeholderText="Month"
      className="border rounded px-2 py-1 w-full focus:outline-none"
    />
    <input
      type="number"
      placeholder="Min value"
      value={filterAmountMin}
      onChange={e => setFilterAmountMin(e.target.value)}
      className="border rounded px-2 py-1 w-full"
    />
    <input
      type="number"
      placeholder="Max value"
      value={filterAmountMax}
      onChange={e => setFilterAmountMax(e.target.value)}
      className="border rounded px-2 py-1 w-full"
    />
    <button
      type="button"
      onClick={onReset}
      className="px-3 py-1 bg-gray-200 rounded w-full"
      style={{ minWidth: "90px" }}
    >
      Reset
    </button>
  </div>
</div>
);

export default TransactionFilter;