import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="flex h-screen bg-amber-400">
            <div className="w-64 bg-amber-50 border-r">
                <h1 className="logo_placeholder m-8 mb-10 font-bold">CMS safe space</h1>

                <Link to="/user/dashboard">
                Dashboard
                </Link>

                <Link to="/user/register-complaints">
                Register Complaints
                </Link>

                <Link to="/user/my-complaints">
                My Complaints
                </Link>

                <Link to="/user/profile">
                Profile
                </Link>

                <Link to="/user/logout">
                logout
                </Link>

            </div>

            <div className="flex-1 bg-amber-200">
                <Outlet/>
            </div>
        </div>
    );
}
