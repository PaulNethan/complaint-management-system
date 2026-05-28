import { useOutletContext } from "react-router-dom"
import { useState, useEffect } from "react"


export default function MasterComplaintsPage() {

    const role = useOutletContext()
    const token = localStorage.getItem("token")
    const [complaints, setComplaints] = useState([])
    const [ActiveTab, setActiveTab] = useState("unassigned")
    const unassigned = complaints.filter((c) => c.assigned_to == null)
    const assigned = complaints.filter((c) => c.assigned_to !== null)
    const [authority, setauthority] = useState([])

    const getComplaints = async () => {
        const response = await fetch("http://localhost:8000/api/user/getmastercomplaints/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role })
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


    const getAuthorities = async () => {
        const response = await fetch("http://localhost:8000/api/authorityroster/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: role })
        })
        if (response.ok) {
            const data = await response.json()
            setauthority(data.message)
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
    useEffect(() => {
        getComplaints();
        getAuthorities();
    }, [role])


    const handelassign = async (authid, complaintid) => {
        const response = await fetch("http://localhost:8000/api/assigncomplaint/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ complaint_id: complaintid, authority_id: authid })
        })
        if (response.ok) {
            const data = await response.json()
            alert(data.message)
            getComplaints();
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

    return (
        <div>
            <h2>Master Complaint Log ({role})</h2>
            <div>
                <button type="button" onClick={() => setActiveTab("unassigned")}>Unassigned Cases ({unassigned.length})</button>
                <button type="button" onClick={() => setActiveTab("assigned")}>Assigned Cases ({assigned.length})</button>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Status</th>
                            {ActiveTab === "unassigned" ? <th>Action</th> : <th>Assigned To</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {ActiveTab === "unassigned" ? (
                            unassigned.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.complaint_type}</td>
                                    <td>{c.severity_level}</td>
                                    <td>{c.complaint_status}</td>
                                    <td>
                                        <select onChange={(e) => handelassign(e.target.value, c.id)}>
                                            <option value="">Assign officer</option>
                                            {authority.map((current) => (
                                                <option value={current.id} key={current.id}>{current.id}</option>

                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            assigned.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.complaint_type}</td>
                                    <td>{c.severity_level}</td>
                                    <td>{c.complaint_status}</td>
                                    <td>User ID: {c.assigned_to}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}