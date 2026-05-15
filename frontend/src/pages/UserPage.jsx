import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function UserPage() {

    const navigate = useNavigate();
    const checkProtected = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/userpage/", {
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
    }, [])
    return (
        <div>
            <p>welcome to protected user profile page</p>
        </div>
    )
}