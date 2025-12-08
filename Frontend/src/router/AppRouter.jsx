import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import BusinessPage from "../pages/BusinessPage/BusinessPage";
import DashboardAdmin from "../pages/DashboardAdmin/DashboardAdmin";
import DashboardBusiness from "../pages/DashboardBusiness/DashboardBusiness";
import DashboardUser from "../pages/DashboardUser/DashboardUser";
import NotFound from "../pages/NotFound/NotFound";

import PrivateRoute from "./PrivateRoute";

export default function AppRouter() {
    return (
        // <BrowserRouter>
            <Routes>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/business/:id" element={<BusinessPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
                        <Route path="/dashboard/business" element={<DashboardBusiness />} />
                        <Route path="/dashboard/user" element={<DashboardUser />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        // </BrowserRouter>
    );
}
