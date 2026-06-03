import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { List } from "lucide-react";
import { User } from "lucide-react";
import { LogOut, FileText } from "lucide-react";

export default function UserLayout() {
    const navigate = useNavigate();

    const HandelLogout = () => {
        localStorage.removeItem("token");
        navigate('/', { replace: true });
    }
    return (
        <div className="flex h-screen bg-[#F7F8FC]">
            <div className="sidebar w-2/11 bg-[#FFFFFF] flex flex-col justify-between">
                <div className="flex flex-col items-start space-y-3 p-5 gap-6">


                    <div className="flex justify-center items-center gap-1.5">
                        <div className="text-white bg-black rounded-md p-1.5">
                            <Shield size={24} />
                        </div>

                        <h1 className="logo_placeholder font-bold text-black text-lg ">CMS safe space</h1>
                    </div>

                    <div className="space-y-4 flex flex-col justify-start w-full">

                        <Button asChild variant="ghost" className="text-black hover:text-white hover:bg-[#262626] ">
                            <Link to="/user/dashboard" className="items-center justify-start">
                                <LayoutDashboard /> Dashboard
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" className="text-black hover:text-white hover:bg-[#262626] ">
                            <Link to="/user/register-complaints" className="items-center justify-start">
                                <FileText /> Register Complaints
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" className="text-black hover:text-white hover:bg-[#262626] ">
                            <Link to="/user/my-complaints" className="items-center justify-start">
                                <List /> My Complaints
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" className="text-black hover:text-white hover:bg-[#262626] ">
                            <Link to="/user/profile" className="items-center justify-start">
                                <User /> Profile
                            </Link>
                        </Button>
                    </div>


                </div>
                <div className="p-5">
                    <Button type="button" variant="outline" className="w-full text-red-700 rounded-2xl p-1.5 hover:bg-[#FEF2F2] hover:text-red-700" onClick={HandelLogout}>
                        <LogOut />logout
                    </Button>
                </div>



            </div>

            <div className="flex-1">
                <Outlet />
            </div>
        </div >
    );
}
