import { useEffect, useState } from "react";

export default function AssignedComplaintsPage() {
    const token = localStorage.getItem("token");
    const [complaints, setComplaints] = useState([]);

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
                        <p>icon</p>
                    </div>
                    <div>
                        <p id="badge-text">Total Assigned Complaints</p>
                        <span>{complaints.length}</span>
                    </div>
                </div>

            </div>

        </div>
    );
}
