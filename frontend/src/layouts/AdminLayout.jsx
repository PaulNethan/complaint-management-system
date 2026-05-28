import { useEffect, useState } from "react"
import { Link, Outlet, replace, useNavigate } from "react-router-dom"


export default function AdminLayout() {

    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [role, setRole] = useState('police')
    const checkProtected = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/authoritylayout/", {
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

        <div className="flex h-screen">
            <div className="sidebar w-64 bg-amber-50 border-r flex-col gap-4">
                <h1 className="logo_placeholder m-8 mb-10 font-bold">CMS Admin page</h1>

                <Link to={"/admin/pending_approval"}>Pending approval</Link><br />
                <Link to={"/admin/AuthorityRosterPage"}>Authority Roster</Link><br />
                <Link to={"/admin/MasterComplaintsPage"}>Master Complaints</Link><br />
                <button type="button" className="text-white bg-red-600 rounded-2xl p-1.5" onClick={() => handlelogout()}>Logout</button>
            </div>
            <div className="main-content">
                <div>
                    <button className="m-8" onClick={() => { setRole('police') }}>police</button>
                    <button className="m-8" onClick={() => { setRole('cyber_crime') }}>cyber crime</button>
                </div>
                <Outlet context={role} />
            </div>
        </div>

    )
}