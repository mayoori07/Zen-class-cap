import { BrowserRouter ,Route,Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/projects/dashboard";
import FormDetails from "./pages/projects/formDetail";
import FormTask from "./pages/tasks/formTask";
import AsignedTask from "./pages/asignedTask/asignedTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form-details" element={<FormDetails />} />
        <Route path="/form-task-details" element={<FormTask />} />
        <Route path="/Asinged-Task-Dashboard" element={<AsignedTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
