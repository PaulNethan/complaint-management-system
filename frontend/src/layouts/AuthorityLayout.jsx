import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { LayoutDashboard } from "lucide-react";
import { List } from "lucide-react";
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import { apiFetch } from "@/services/api";




export default function AuthorityLayout() {

    const navigate = useNavigate();

    const checkProtected = async () => {
        const response = await apiFetch("/api/authoritylayout/", {
            method: "POST",
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data)
        } else {
            navigate('/')
        }
    }
    useEffect(() => {
        checkProtected()
    }, [])

    const HandelLogout = async () => {
        const response = await apiFetch("/api/logout/", {
            method: "POST",
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data.message)
            navigate('/')

        }
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



                        <Button type="button" asChild variant="ghost" className=" w-full text-black hover:text-white hover:bg-[#262626] ">

                            <Link to="/authority/AssignedCasePage" className="items-center justify-start">
                                <LayoutDashboard />Assigned Complaints
                            </Link>
                        </Button>


                        <Button type="button" asChild variant="ghost" className="w-full text-black hover:text-white hover:bg-[#262626]">
                            <Link to="/authority/AvailableComplaints" className="items-center justify-start">
                                <List />Available Complaints
                            </Link>
                        </Button>


                        <Button type="button" asChild variant="ghost" className="w-full text-black hover:text-white hover:bg-[#262626]">
                            <Link to="/authority/AuthorityProfilePage" className="items-center justify-start">
                                <User />Profile
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

            <div className="flex-1 ">
                <Outlet />
            </div>
        </div>
    )
}

