import React, { useState, useEffect } from "react";
import DashboardLayout  from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const[openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

            if (response.data) {
                setExpenseData(response.data);
            } 
        } catch (err) {
            console.log("Something went wrong. Please try again.", err);
        } finally {
            setLoading(false);
        }

    };

    const handleAddExpense = async (expense) => {
        const {category, amount, date, icon} = expense;

        if (!category.trim()) {
            toast.error("Category is required.");
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
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category,
                amount,
                date,
                icon,
            });

            setOpenAddExpenseModal(false);
            toast.success("Expense added successfully");
            fetchExpenseDetails();

        } catch (err) {
            console.log("Error adding expense:", err.response?.data?.message || err.message);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

            setOpenDeleteAlert({show: false, data: null});
            toast.success("Expense details deleted successfully");
            fetchExpenseDetails();
        } catch (err) {
            console.error("Error deleting Expense:", err.response?.data?.message || err.message);
        }
    };
    
    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                {
                    responseType:"blob" //serverul va returna un fișier binar 
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data])); //creează un URL temporar pentru fișierul respectiv, pe care browserul îl poate folosi ca și cum ar fi un fișier local.
            const link = document.createElement("a"); //Creez dinamic un element HTML <a> (link).
            //setez atributele pentru <a>
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click(); //ceea ce simulează un click și declanșează descărcarea.
            link.parentNode.removeChild(link); //Ștergi link-ul din DOM, pentru că nu mai e necesar.
            window.URL.revokeObjectURL(url); //Și „eliberezi” URL-ul temporar din memorie cu revokeObjectURL()

        } catch (err) {
            console.error("Error downloading expense details:", err);
            toast.error("Failed to download expense details. Please try again.");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
    }, []);

    return (
        <DashboardLayout activeMenu="Expense">
        <div className="my-5 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="">
                        <ExpenseOverview
                            transactions={expenseData}
                            onExpenseIncome={() => setOpenAddExpenseModal(true)}
                        />
                </div>

                <ExpenseList
                    transactions={expenseData}
                    onDelete={(id) => {
                        setOpenDeleteAlert({ show: true, data: id});
                    }}
                    onDownload={handleDownloadExpenseDetails}
                />
            </div>

            <Modal 
                isOpen={openAddExpenseModal}
                onClose={() => setOpenAddExpenseModal(false)}
                title="Add Expense"
            >
                <AddExpenseForm onAddExpense={handleAddExpense} />
            </Modal>

            <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({show: false, data: null})}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense details?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
        </div>
    </DashboardLayout>
    )
}

export default Expense