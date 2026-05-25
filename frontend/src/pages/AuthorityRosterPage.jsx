import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useState } from "react"

export default function AuthorityProfilePage() {

    const token = localStorage.getItem("token")
    const role = useOutletContext();
    const [authorities, setAuthorities] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState(null)


    useEffect(() => {
        const getAuthorities = async () => {
            const response = await fetch("http://localhost:8000/api/authority/getapprovedauth/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: role })
            })
            if (response.ok) {
                const data = await response.json()
                setAuthorities(data.message)
                console.log(data.message)
            }
            else {
                try {
                    const data = await response.json()
                    alert(data.message || "An error occurred")
                } catch (error) {
                    console.error("Failed to parse error response:", error);
                    alert(`Request failed with status: ${response.status}`);
                }
            }
        }
        getAuthorities()
    }, [role])

    const getComplaints = async (authorityId) => {
        setSelectedAuth(authorityId)
        const response = await fetch("http://localhost:8000/api/user/getauthoritycomplaints/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ authority_id: authorityId })
        })
        if (response.ok) {
            const data = await response.json()
            setComplaints(data.message)
            console.log(data.message)
        }
        else {
            try {
                const data = await response.json()
                alert(data.message || "An error occurred")
            } catch (error) {
                console.error("Failed to parse error response:", error);
                alert(`Request failed with status: ${response.status}`);
            }

        }
    }

    const handleRemoveComplaint = async (complaintId) => {
        const response = await fetch("http://localhost:8000/api/user/revokecaseaccess/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ complaint_id: complaintId })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);

            // Refresh the complaints list inside the modal immediately
            if (selectedAuth) {
                getComplaints(selectedAuth.id);
            }
        } else {
            try {
                const data = await response.json();
                alert(data.message || "Could not remove complaint.");
            } catch (error) {
                console.error("Failed to parse error response:", error);
                alert(`Failed with status: ${response.status}`);
            }
        }
    };
    return (
        <div>
            <p id="header">authority roster page</p>
            <label htmlFor="header">Revoke authority access / remove complaints </label>
            <table>
                <thead >
                    <tr>
                        <th>id</th>
                        <th>Authority Type</th>
                        <th>Email</th>
                        <th>phone no</th>
                        <th>View Complaints</th>
                        <th>Remove Authority</th>
                    </tr>
                </thead>
                <tbody>
                    {authorities.map((authority) => (
                        <tr key={authority.id}>
                            <td>{authority.id}</td>
                            <td>{authority.authority_type}</td>
                            <td>{authority.email}</td>
                            <td>0800850640550</td>
                            <td><button type="button" onClick={async () => { await getComplaints(authority.id) }}>View Complaints</button></td>
                            <td><button>Remove Authority</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}