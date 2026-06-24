import { Routes, Route } from "react-router-dom";
import "@/styles/global.css";
import Login from "./../src/ui/pages/Login";
import MainLayout from "./../src/ui/layouts/MainLayout";
import Dashboard from "./../src/ui/pages/Dashboard";
import Calendar from "./../src/ui/pages/Calendar";
import WorkOrders from "./../src/ui/pages/WorkOrders";
import Requests from "./../src/ui/pages/Requests";
import RequestForm from "./../src/ui/pages/forms/RequestForm";
import Hospitals from "./../src/ui/pages/Hospitals";
import Items from "./../src/ui/pages/Items";
import ItemsForm from "./../src/ui/pages/forms/ItemForm";
import Users from "./../src/ui/pages/Users";
import { AuthProvider } from "./../context/AuthContext";
import { ProtectedRoute } from "./../src/ui/layouts/ProtectedRoute";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas SIN layout */}
        <Route path="/" element={<Login />} />

        {/* Rutas CON MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/hospitals" element={<Hospitals />} />

            <Route path="/requests">
              <Route index element={<Requests />} />
              <Route path="new" element={<RequestForm />} />
              <Route path="edit/:id" element={<RequestForm isEdit={true} />} />
            </Route>

            <Route path="/items">
              <Route index element={<Items />} />
              <Route path="new" element={<ItemsForm />} />
              <Route path="edit/:id" element={<ItemsForm isEdit={true} />} />
            </Route>

            <Route path="/users" element={<Users />} />
            {/* <Route path="/schedule" element={<Schedule />} /> */}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
