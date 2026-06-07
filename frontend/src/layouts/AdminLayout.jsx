import { useEffect, useState } from "react"
import { Link, Outlet, replace, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"


export default function AdminLayout() {

    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const checkProtected = async () => {
        const response = await fetch(window.API_BASE_URL + "/api/authoritylayout/", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data.message)
        } else {
            navigate('/')
        }
    }


    useEffect(() => {
        checkProtected()
    }, [])


    const handlelogout = () => {
        navigate("/", { replace: true });
        localStorage.removeItem('token');
    }

    return (

        <div className="flex h-screen bg-[#0A0A0A]">
            <div className="sidebar w-2/9 bg-[#0A0A0A] m-9 flex flex-col justify-between">


                <div className="flex flex-col items-start space-y-3 ">
                    <div className="flex justify-center gap-1.5 ">
                        <div className="text-white ">
                            <Shield />
                        </div>
                        <h1 className="logo_placeholder mb-10 font-bold text-white text-2xl ">CMS Admin page</h1>
                    </div>
                    <div className=" flex flex-col space-y-2.5  items-start">
                        <Button type="button" asChild variant="ghost" className="text-white hover:text-white hover:bg-[#262626] "><Link to={"/admin/pending_approval"}>Pending approval</Link></Button>
                        <Button type="button" asChild variant="ghost" className="text-white hover:text-white hover:bg-[#262626]"><Link to={"/admin/AuthorityRosterPage"}>Authority Roster</Link></Button>
                        <Button type="button" asChild variant="ghost" className="text-white hover:text-white hover:bg-[#262626]"><Link to={"/admin/MasterComplaintsPage"}>Master Complaints</Link></Button>
                    </div>

                </div>

                <div className=" flex items-start ml-5   ">
                    <Button type="button" variant="ghost" className="text-white hover:text-white hover:bg-[#262626] my-6" onClick={() => handlelogout()}>Logout</Button>

                </div>
            </div>
            <div className="main-content">

                <Outlet />
            </div>
        </div>

    )
}