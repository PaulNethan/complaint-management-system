import { Link, Outlet, useNavigate } from "react-router-dom";
    
export default function UserLayout() {
    const navigate = useNavigate();

    const HandelLogout = () =>{
        localStorage.removeItem("token");
        navigate('/',{replace: true});
    }
    return (
        <div className="flex h-screen">
            <div className="w-64 bg-amber-50 border-r flex-col gap-4">
                <h1 className="logo_placeholder m-8 mb-10 font-bold">CMS safe space</h1>

                <div>
                <Link to="/user/dashboard">
                Dashboard
                </Link>
                </div>

                <div>
                <Link to="/user/register-complaints">
                Register Complaints
                </Link>
                </div>

                <div>
                <Link to="/user/my-complaints">
                My Complaints
                </Link>
                </div>

                <div>
                <Link to="/user/profile">
                Profile
                </Link>
                </div>


                <button type="button" className="text-white bg-red-600 rounded-2xl p-1.5" onClick={HandelLogout}>
                    logout
                </button>

            </div>

            <div className="flex-1 bg-amber-200">
                <Outlet/>
            </div>
        </div>
    );
}
