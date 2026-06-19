import {Outlet} from "react-router";
import AdminHeader from "@/sections/admin/AdminHeader";
import "./AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">
            <AdminHeader />
            <main className="admin-layout__main">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
