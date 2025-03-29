import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import Home from "./pages/Deashboard/Home"
import Income from "./pages/Deashboard/Income"
import Expense from "./pages/Deashboard/Expenses"
import UserProvider from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App


const Root = () => {
  const isAuthentificated = !!localStorage.getItem("token");

  return isAuthentificated ? (
  <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};