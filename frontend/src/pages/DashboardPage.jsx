import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { FileText, Clock, CirclePlay, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function DashboardPage() {

    const token = localStorage.getItem("token");
    const [complaint, setComplaint] = useState([])
    const recentComplaints = [...complaint].reverse().slice(0, 3);



    const pending_complaints = complaint.filter(c => c.complaint_status === "pending")
    const in_progress = complaint.filter(c => c.complaint_status === "in_progress")
    const resolved = complaint.filter(c => c.complaint_status === "resolved")

    const dashboardData = async () => {

        const response = await fetch(window.API_BASE_URL + "/api/user/viewcomplaints/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.json();
        setComplaint(data.all_complaint_details);
    }
    useEffect(() => {
        dashboardData();
    }, []);

    const handelRecentComplaints = () => {
        if (recentComplaints.length === 0) {
            return (
                <div>
                    <p>No recent complaints found.</p>
                </div>
            )
        }
        if (recentComplaints.length >= 1 && recentComplaints.length <= 3) {
            return (
                <>
                    {recentComplaints.map((complaint) => {
                        return (
                            <div className="flex gap-5 bg-white rounded-2xl m-4 p-3 " key={complaint.id}>

                                <div className="w-1/5">
                                    <p>pending</p>
                                </div>

                                <div>
                                    <div >
                                        <p>{complaint.complaint_type} Report - {complaint.incident_date}</p>
                                        <p className="opacity-50 line-clamp-3">INCIDENT DETAILS:- Date:{complaint.incident_date}- Time:{complaint.incident_time ? complaint.incident_time : "Not provided"} -
                                            Ongoing:{complaint.on_going ? "YES" : "NO"} VICTIM INFORMATION:- Reporter is victim:{complaint.vitim ? "YES" : "NO"} - Victim Name: {complaint.victim_name ? complaint.victim_name : "Not provided"} -
                                            Victim Contact:{complaint.victim_contact ? complaint.victim_contact : "Not provided"} - ACCUSED DETAILS:- Name: {complaint.victim_name ? complaint.victim_name : "Not Provided"} -
                                            Relationship: {complaint.relationship_to_victim ? complaint.relationship_to_victim : "Not provided"} description
                                        </p>
                                        <p className="opacity-40">logo {complaint.complaint_type} logo {complaint.incident_date}</p>
                                    </div>
                                </div>
                                <div className="w-1/5">
                                    <Link to={`/user/complaint/${complaint.id}`} state={complaint} >
                                        <Button type="button" variant="secondary">view Details</Button>

                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </>
            )
        }
    }


    return (
        <div className=" min-h-screen flex flex-col space-y-8  p-9 bg-[#F7F8FC]">

            <div className="header mb-10">
                <p className="text-2xl font-bold" id="header">Dashboard</p>
                <label htmlFor="header" className="opacity-50">Track your complaints securely</label>
            </div>


            <div className="flex gap-6  mb-10">

                <Card className="flex flex-row items-center rounded-2xl gap-2.5 py-2.5 px-4 flex-1">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText />
                    </div>

                    <div>
                        <p id="countTotal" className="text-black text-xs font-semibold uppercase tracking-wider opacity-55">Total Complaints</p>
                        <label htmlFor="countTotal" className="text-2xl font-bold">{complaint.length}</label>
                    </div>
                </Card>

                <Card className="flex flex-row rounded-2xl gap-2.5 p-2 items-center flex-1 py-5 px-4">
                    <div className="h-12 w-12 bg-[#FFFBEB] text-[#E17100] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock />
                    </div>

                    <div>
                        <p id="countPending" className="text-black text-xs font-semibold uppercase tracking-wider opacity-55">Pending</p>
                        <label htmlFor="countPending" className="text-2xl font-bold">{pending_complaints.length}</label>
                    </div>
                </Card>

                <Card className="flex flex-row rounded-2xl gap-2.5 p-2 items-center flex-1 py-5 px-4">
                    <div className="h-12 w-12 bg-[#EEF2FF] text-[#4F39F6] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <CirclePlay />
                    </div>

                    <div>
                        <p id="countProgress" className="text-black text-xs font-semibold uppercase tracking-wider opacity-55">In Progress</p>
                        <label htmlFor="countProgress" className="text-2xl font-bold">{in_progress.length}</label>
                    </div>
                </Card>

                <Card className="flex flex-row rounded-2xl gap-2.5 p-2 items-center flex-1 py-5 px-4">
                    <div className="h-12 w-12 bg-[#ECFDF5] text-[#009966] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <CircleCheckBig />
                    </div>

                    <div>
                        <p id="countResolved" className="text-black text-xs font-semibold uppercase tracking-wider opacity-55">Resolved</p>
                        <label htmlFor="countResolved" className="text-2xl font-bold">{resolved.length}</label>
                    </div>
                </Card>
            </div>

            <Card className="p-5">
                <div className="flex justify-between mb-3.5">
                    <p className="font-bold text-2xl">Recent complaints</p>
                    <Button asChild variant="outline">
                        <Link to="/user/register-complaints">
                            Raise New Complaints
                        </Link>
                    </Button>
                </div>

                {handelRecentComplaints()}
            </Card>



        </div>
    )
}