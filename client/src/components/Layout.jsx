import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {

    return (
        <div className="flex w-full">

            <Sidebar />

            <div className="flex-1 p-8">
                <Outlet />
            </div>

        </div>
    );
}