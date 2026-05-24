import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";

export default function CaseDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [complaint, setComplaints] = useState(location.state);
    const token = localStorage.getItem("token")
    const [progress, setProgress] = useState(complaint.complaint_status);

    useEffect(() => {
        const updateProgress = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/user/update_status/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ complaint_id: complaint.id, complaint_status: progress }),
            });
            const data = await response.json();
            console.log(data.message);
        };
        updateProgress();
    }, [progress])



    const handelButtons = () => {
        if (progress === "pending") {
            return (
                <div>
                    <button> contact \ notification </button>
                    <br />
                    <button type="button" onClick={() => setProgress("in_progress")}>mark as in progress</button>
                </div>
            )
        }
        if (progress === "in_progress") {
            return (
                <div>
                    <p>once the case is marked as resolved you can't undo and you'll be removed from the case </p>
                    <br />
                    <button> contact \ notification </button>
                    <br />
                    <button type="button" onClick={() => setProgress("resolved")}>mark as resolved</button>
                </div>
            )
        }
        if (progress === "resolved") {
            return (
                <p> case has been marked as resolved</p>
            )
        }
    }
    return (
        <div className="mx-44 my-10">

            <div className="header flex mb-8">
                <button type="button" onClick={() => navigate(-1)}>⬅</button>
                <div>
                    <p id="id" className="text-3xl font-bold">Complaint Details</p>
                    <label htmlFor="id" className="opacity-50">#{complaint.id}</label>
                </div>
            </div>

            <div className="container flex gap-6 bg-amber-50 justify-around">

                <div className="detailed_description">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-2xl ">{complaint.complaint_type} Report - {complaint.incident_date}</p>
                        <p>{complaint.complaint_status}</p>
                    </div>
                    <div className="flex">
                        <p>date_icon {complaint.incident_date}</p>
                        <p>loca_icon {complaint.incident_location}</p>
                    </div>
                    <div className="flex">
                        <p>assu_icon {complaint.complaint_type}</p>
                        <p>emer_icon {complaint.severity_level}</p>
                    </div>

                    <label htmlFor="description">Description</label>
                    <div id="description">
                        <p>{complaint.detailed_description}</p>
                    </div>

                </div>


                <div className="status_timeline">

                    <p>Status Timeline</p>

                    <div>

                        <div className="flex">

                            <div>
                                icon1
                            </div>

                            <div>
                                <p>Submitted</p>
                                <p>Complaint received</p>
                            </div>

                        </div>

                        <div className="flex">

                            <div>
                                icon2
                            </div>

                            <div>
                                <p>In Progress</p>
                                <p>Investigation ongoing</p>
                            </div>

                        </div>

                        <div className="flex">

                            <div>
                                icon3
                            </div>

                            <div>
                                <p>Resolved</p>
                                <p>Action taken</p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
            {handelButtons()}
        </div >
    )
}