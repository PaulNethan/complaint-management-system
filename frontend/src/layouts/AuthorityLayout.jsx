import { useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"


export default function AuthorityLayout() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const checkProtected = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/authoritylayout/", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
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
    })

    const HandelLogout = () => {
        localStorage.removeItem('token')
        navigate('/', { replace: true });

    }
    return (
        <div className="flex h-screen">
            <div className="w-64 bg-amber-50 border-r flex-col gap-4">
                <h1 className="logo_placeholder m-8 mb-10 font-bold">CMS safe space</h1>

                <div>
                    <Link to="/authority/AssignedCasePage">
                        Assigned Complaints
                    </Link>
                </div>


                <div>
                    <Link to="/authority/AvilableComplaints">
                        Avilable Complaints
                    </Link>
                </div>

                <div>
                    <Link to="/authority/AdminProfilePage">
                        Profile
                    </Link>
                </div>


                <button type="button" className="text-white bg-red-600 rounded-2xl p-1.5" onClick={HandelLogout}>
                    logout
                </button>

            </div>

            <div className="flex-1 bg-amber-200">
                <Outlet />
            </div>
        </div>
    )
}

