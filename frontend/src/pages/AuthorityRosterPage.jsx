import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useState } from "react"
import React from "react"

export default function AuthorityProfilePage() {

    const token = localStorage.getItem("token")
    const role = useOutletContext();
    const [authorities, setAuthorities] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState(null)



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


    useEffect(() => {
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

    const handlebanauth = async (authorityId) => {
        const response = await fetch("http://localhost:8000/api/user/banauthority/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ authority_id: authorityId })
        });
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            getAuthorities();
        }
        else {
            try {
                const data = await response.json();
                alert(data.message || "Could not ban authority");
            } catch (error) {
                console.error("Failed to parse error response:", error);
                alert(`Failed with status: ${response.status}`);
            }
        }
    }
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
                        <React.Fragment key={authority.id}>
                            <tr>
                                <td>{authority.id}</td>
                                <td>{authority.authority_type}</td>
                                <td>{authority.email}</td>
                                <td>0800850640550</td>
                                <td><button type="button" onClick={async () => {
                                    if (selectedAuth === authority.id) {
                                        setSelectedAuth(null);
                                        setComplaints([]);
                                    } else {
                                        await getComplaints(authority.id);
                                    }
                                }}>{selectedAuth === authority.id ? "Close" : "View Complaints"}</button></td>
                                <td><button type="button" onClick={async () => { await handlebanauth(authority.id) }}>Remove Authority</button></td>
                            </tr>
                            {selectedAuth === authority.id && (
                                <tr>
                                    <td colSpan="6">
                                        <div>
                                            <h4>Assigned complaints</h4>
                                            {complaints.length === 0 ? (<p>No assigned complaints</p>) : (
                                                <ul>
                                                    {complaints.map((c) => (
                                                        <li key={c.id}>
                                                            <span>{c.complaint_type} - {c.complaint_status}</span>
                                                            <button type="button" onClick={() => handleRemoveComplaint(c.id)}>Remove Complaint</button>

                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </td>
                                </tr>


                            )}

                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div >
    )
}