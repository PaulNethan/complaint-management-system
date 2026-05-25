import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function PendingApprovalsPage() {

    const role = useOutletContext();
    const token = localStorage.getItem('token')
    const [authority, setAuthority] = useState([]);
    const [filter, setFilter] = useState("")

    const filteredAuthorities = authority.filter((auth) => {
        return auth.email.toLowerCase().includes(filter.toLowerCase())
    })

    const getAuthorities = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/pendingauthority/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ department: role })
        })
        if (response.ok) {
            const data = await response.json()
            console.log("Fetched data for:", role, data.message)
            setAuthority(data.message)
        }
    }
    useEffect(() => {
        getAuthorities();
    }, [role])


    const handleAccess = async (authId) => {
        const response = await fetch("http://127.0.0.1:8000/api/authority/approveauthority/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: authId })
        })
        if (response.ok) {
            const data = await response.json()
            alert(data.message)
            console.log("data", data.message)
        }
        else {
            try {
                const data = await response.json()
                alert(data.message || "An error occurred.")
            } catch (error) {
                console.error("Failed to parse error response:", error);
                alert(`Request failed with status: ${response.status}`);
            }
        }
        getAuthorities();
    }
    return (
        <div>
            <h1 id="header">Pending Approvals page</h1>
            <label htmlFor="header">Review and approve pending authority registrations</label>

            <div className="main container">
                <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter authority" />

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>activate</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAuthorities.map((auth) => (
                            <tr key={auth.id}>
                                <td>hard Paul</td>
                                <td>{auth.email}</td>
                                <td>hard 9876543210</td>
                                <td><button type="button" onClick={() => handleAccess(auth.id)}>Grant Access</button></td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    )
}