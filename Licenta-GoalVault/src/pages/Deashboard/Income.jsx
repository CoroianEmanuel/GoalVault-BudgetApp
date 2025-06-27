import React, {useEffect, useState} from "react";
import DashboardLayout  from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import {useUserAuth} from "../../hooks/useUserAuth"
import TransactionFilter from "../../components/Filters/TransactionFilter";


const Income = () => {
    useUserAuth();

    const [editIncome, setEditIncome] = useState(null);
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const[openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    //all functions for income
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}`
            );

            if (response.data) {
                setIncomeData(response.data);
            } 
        } catch (err) {
            console.log("Something went wrong. Please try again.", err);
        } finally {
            setLoading(false);
        }

    };

    const handleAddIncome = async (income) => {
        const {source, amount, date, icon} = income;

        if (!source.trim()) {
            toast.error("Source is required.");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a vaild number greather than 0.");
            return;
        }

        if (!date) {
            toast.error("Date is required.");
            return;
        }

        try{
            if (editIncome) {
                await updateIncome(editIncome.id, { source, amount, date, icon });
                setEditIncome(null);
            } else {
                await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                    source,
                    amount,
                    date,
                    icon,
                });
                toast.success("Income added successfully");
            }

            setOpenAddIncomeModal(false);
            fetchIncomeDetails();

        } catch (err) {
            console.log("Error adding income:", err.response?.data?.message || err.message);
        }

    };

    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

            setOpenDeleteAlert({show: false, data: null});
            toast.success("Income details deleted successfully");
            fetchIncomeDetails();
        } catch (err) {
            console.error("Error deleting income:", err.response?.data?.message || err.message);
        }
    };

    const updateIncome = async (id, updatedIncome) => {
        try {
            await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(id), updatedIncome);
            toast.success("Income updated successfully");
            fetchIncomeDetails();
        } catch (err) {
            console.error("Error updating income:", err.response?.data?.message || err.message);
            toast.error("Failed to update income.");
        }
    };
    
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                {
                    responseType:"blob" //serverul va returna un fișier binar 
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data])); //creează un URL temporar pentru fișierul respectiv, pe care browserul îl poate folosi ca și cum ar fi un fișier local.
            const link = document.createElement("a"); //Creez dinamic un element HTML <a> (link).
            //setez atributele pentru <a>
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link);
            link.click(); //ceea ce simulează un click și declanșează descărcarea.
            link.parentNode.removeChild(link); //Ștergi link-ul din DOM, pentru că nu mai e necesar.
            window.URL.revokeObjectURL(url); //Și „eliberezi” URL-ul temporar din memorie cu revokeObjectURL()

        } catch (err) {
            console.error("Error downloading income details:", err);
            toast.error("Failed to download income details. Please try again.");
        }
    };

    const [filterMonth, setFilterMonth] = useState(null);
    const [filterAmountMin, setFilterAmountMin] = useState("");
    const [filterAmountMax, setFilterAmountMax] = useState("");

    const filteredIncome = incomeData.filter((income) => {
        const incomeMonth = income.date.slice(0, 7); // "YYYY-MM"
        const selectedMonth = filterMonth
            ? filterMonth.getFullYear() + "-" + String(filterMonth.getMonth() + 1).padStart(2, "0")
            : "";
        const matchesMonth = filterMonth ? incomeMonth === selectedMonth : true;
        const matchesMin = filterAmountMin ? Number(income.amount) >= Number(filterAmountMin) : true;
        const matchesMax = filterAmountMax ? Number(income.amount) <= Number(filterAmountMax) : true;
        return matchesMonth && matchesMin && matchesMax;
    });

    useEffect(() => {
        fetchIncomeDetails();
    }, []);

    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <IncomeOverview
                            transactions={filteredIncome}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    <TransactionFilter
                        filterMonth={filterMonth}
                        setFilterMonth={setFilterMonth}
                        filterAmountMin={filterAmountMin}
                        setFilterAmountMin={setFilterAmountMin}
                        filterAmountMax={filterAmountMax}
                        setFilterAmountMax={setFilterAmountMax}
                        onReset={() => {
                            setFilterMonth(null);
                            setFilterAmountMin("");
                            setFilterAmountMax("");
                        }}
                        />

                    <IncomeList 
                        transactions={filteredIncome}
                        onDelete={(id) => {
                            setOpenDeleteAlert({show: true, data: id});
                        }}
                        onDownload={handleDownloadIncomeDetails}
                        onEdit={(income) => {
                            setEditIncome(income);
                            setOpenAddIncomeModal(true);
                        }}
                    />
                </div>
                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => {
                        setOpenAddIncomeModal(false);
                        setEditIncome(null);
                    }}
                    title={editIncome ? "Edit Income" : "Add Income"}
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} editIncome={editIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({show: false, data: null})}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income details?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Income