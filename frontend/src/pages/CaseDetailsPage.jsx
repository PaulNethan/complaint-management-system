import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react"
import { Tally1 } from "lucide-react";
import { Calendar, MapPin, TriangleAlert, FileText, ArrowLeft } from "lucide-react";

export default function CaseDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [complaint, setComplaints] = useState(location.state);
    const token = localStorage.getItem("token")
    const [progress, setProgress] = useState(complaint.complaint_status);

    useEffect(() => {
        const updateProgress = async () => {
            const response = await fetch(window.API_BASE_URL + "/api/user/update_status/", {
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


                    <Button type="button" onClick={() => setProgress("in_progress")}>mark as in progress</Button>
                </div>
            )
        }
        if (progress === "in_progress") {
            return (
                <div>
                    <p>once the case is marked as resolved you can't undo and you'll be removed from the case </p>
                    <br />


                    <Button type="button" onClick={() => setProgress("resolved")}>mark as resolved</Button>
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
        <div className="min-h-screen bg-[#F7F8FC] px-32 py-8">
            <div className=" mx-auto w-full max-w-6xl  flex flex-col space-y-8  bg-[#F7F8FC]">



                <div className="flex flex-row gap-3.5 items-center">
                    <button type="button" onClick={() => navigate(-1)} className="text-lg font-medium">
                        <ArrowLeft />
                    </button>
                    <div>
                        <p id="id" className="text-2xl font-bold">Complaint Details</p>
                        <label htmlFor="id" className="opacity-50">#{complaint.id}</label>
                    </div>
                </div>

                <div className=" flex bg-[#F7F8FC] justify-between gap-5">

                    <Card className="bg-[#FFFFFF] flex flex-2 p-5">

                        <div className="flex justify-between items-center">
                            <p className="font-medium text-2xl ">{complaint.complaint_type} Report - {complaint.incident_date}</p>
                            <Badge variant="secondary" className="">{complaint.complaint_status}</Badge>
                        </div>

                        <div className="flex space-x-3">
                            <div className="flex flex-1 space-x-1 items-center">
                                <div className="opacity-40">
                                    <Calendar size={20} />
                                </div>
                                <p className="text-sm opacity-80">{complaint.incident_date}</p>
                            </div>

                            <div className="flex flex-1 space-x-1 items-center">
                                <div className="opacity-50">
                                    <MapPin size={20} />
                                </div>
                                <p className="text-sm opacity-80"> {complaint.incident_location}</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <div className="flex flex-1 space-x-1 items-center">
                                <div className="opacity-50 ">
                                    <FileText size={20} />
                                </div>
                                <p className="text-sm opacity-80">{complaint.complaint_type}</p>
                            </div>

                            <div className="flex flex-1 space-x-1 items-center">
                                <div className="opacity-50">
                                    <TriangleAlert size={20} />
                                </div>
                                <p className="text-sm opacity-80">{complaint.severity_level}</p>
                            </div>
                        </div>



                        <label htmlFor="description" className="text-lg font-medium">Description</label>
                        <div id="description">
                            <Card className="p-3.5 opacity-85">
                                {complaint.detailed_description}
                            </Card>
                        </div>

                    </Card>


                    <Card className="status_timeline bg-[#FFFFFF] flex flex-1 p-5">

                        <p>Status Timeline</p>

                        <div>

                            <div className="flex">

                                <div className="flex flex-col ">
                                    <CircleCheck />
                                    <Tally1 />
                                </div>

                                <div>
                                    <p>Submitted</p>
                                    <p>Complaint received</p>
                                </div>

                            </div>

                            <div className="flex">

                                <div>
                                    <CircleCheck />
                                </div>

                                <div>
                                    <p>In Progress</p>
                                    <p>Investigation ongoing</p>
                                </div>

                            </div>

                            <div className="flex">

                                <div>
                                    <CircleCheck />
                                </div>

                                <div>
                                    <p>Resolved</p>
                                    <p>Action taken</p>
                                </div>

                            </div>

                        </div>

                    </Card>

                </div>
                <Card className="bg-[#FFFFFF] p-5 w-fit">
                    {handelButtons()}
                </Card>

            </div >
        </div>
    )
}