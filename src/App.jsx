import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Assessment from "./Pages/Assessment";
import Result from "./Pages/Result";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/UserContext";
import AdminLogin from "./Admin/AdminLogin";
import DashboardHome from "./Admin/DashboardHome";
import {
  ManageTopics,
  ActiveAssessment,
  AssessmentHistory,
  ManageStudents,
  ManageCertificate,
  SecuritySettings
} from "./Admin/AdminPages";
import PrintPaper from "./Admin/PrintPaper";
import EditQuestions from "./Admin/EditQuestions";
import AssessmentResult from "./Admin/AssessmentResult";
import TopicQuestions from "./Admin/TopicQuestions";
import AssignQuestions from "./Admin/AssignQuestions";
import AdminDashboard from "./Comp/Admincomp/AdminDashboard";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/result" element={<Result />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Nested Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="topics" element={<ManageTopics />} />
            <Route path="assessment" element={<ActiveAssessment />} />
            <Route path="history" element={<AssessmentHistory />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="certificate" element={<ManageCertificate />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="topic-questions/:topicId" element={<TopicQuestions />} />
            <Route path="assessment/result/:id" element={<AssessmentResult />} />
            <Route path="assign-questions/:id" element={<AssignQuestions />} />
            <Route path="print/:topicId" element={<PrintPaper />} />
            <Route path="edit/:topicId" element={<EditQuestions />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </UserProvider>
  )
}

export default App
