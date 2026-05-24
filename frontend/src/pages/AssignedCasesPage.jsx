import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AssignedComplaintsPage() {

    const token = localStorage.getItem("token");
    const [complaints, setComplaints] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    const filtered_complaints = complaints;

    const pending_complaints = complaints.filter(c => c.complaint_status === "pending")
    const in_progress = complaints.filter(c => c.complaint_status === "in_progress")
    const resolved = complaints.filter(c => c.complaint_status === "resolved")

    if (activeTab === "pending") filtered_complaints = pending_complaints;
    if (activeTab === "in_progress") filtered_complaints = in_progress;
    if (activeTab === "resolved") filtered_complaints = resolved;





    useEffect(() => {
        const getAssignedComplaints = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/user/getComplaints/", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            console.log(data.complaints);
            setComplaints(data.complaints);
        };
        getAssignedComplaints();
    }, []);

    return (
        <div>
            <div className="flex flex-col">
                <p id="header" className="font-bold text-2xl">My assigned complaints</p>
                <label htmlFor="header" className="opacity-50">Track your complaints securely</label>
            </div>
            <div className=" badges flex justify-around p-1.5">
                <div className="total complaints badge flex">
                    <div>
                        <p>total icon</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => setActiveTab("all")}>Total  Complaints</button>
                        <span>{complaints.length}</span>
                    </div>
                </div>

                <div className="pending complaints badge flex">
                    <div>
                        <p>pending icon</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => setActiveTab("pending")}>Pending Complaints</button>
                        <span>{pending_complaints.length}</span>
                    </div>
                </div>

                <div className="in progress complaints badge flex">
                    <div>
                        <p>icon</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => setActiveTab("in_progress")}>In progress Complaints</button>
                        <span>{in_progress.length}</span>
                    </div>
                </div>

                <div className="resolved complaints badge flex">
                    <div>
                        <p>icon</p>
                    </div>
                    <div>
                        <button type="button" onClick={() => setActiveTab("resolved")}>Resolved Complaints</button>
                        <span>{resolved.length}</span>
                    </div>
                </div>

            </div>
            <div>

                <table className="">
                    <thead>
                        <tr>
                            <th className="opacity-50">ID</th>
                            <th className="opacity-50">REPORTER</th>
                            <th className="opacity-50">TITLE & CATEGORY</th>
                            <th className="opacity-50">PRIORITY</th>
                            <th className="opacity-50">DATE</th>
                            <th className="opacity-50">STATUS</th>
                            <th className="opacity-50">TAKE COMPLAINT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered_complaints.map((c) => (
                            <tr key={c.id}>
                                <td className="p-2">#{c.id}</td>
                                <td className="p-2">
                                    <div>
                                        <p className="p-2">hard user name</p>
                                        <p className="p-2">{c.email}</p>
                                    </div>
                                </td>
                                <td className="p-2">{c.complaint_type} Report - {c.incident_date}</td>
                                <td className="p-2">{c.severity_level}</td>
                                <td className="p-2">{c.incident_date}</td>
                                <td className="p-2">{c.complaint_status}</td>
                                <td className="p-2">
                                    <Link to={`/authority/AssignedCasePage/${c.id}`} state={c}>
                                        <button type="button">View Details</button>
                                    </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
