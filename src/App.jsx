import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Assessment from "./Pages/Assessment";
import Result from "./Pages/Result";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </UserProvider>
  )
}

export default App
