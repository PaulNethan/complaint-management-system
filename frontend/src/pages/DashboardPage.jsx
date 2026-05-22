import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


export default function DashboardPage() {

    const token = localStorage.getItem("token");
    const [complaint, setComplaint] = useState([])

    /*hard coded state*/
    const totalCount = complaint.length
    const pending = complaint.length
    const inprogress = 0;
    const resolved = 0;
    const recentComplaints = complaint.slice(0, 3);

    const dashboardData = async () => {

        const response = await fetch("http://127.0.0.1:8000/api/user/viewcomplaints/", {
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
        if(recentComplaints.length === 0){
            return(
                <div>
                    <p>No recent complaints found.</p>
                </div>
            )
        }
        if(complaint.length >= 1){
            return(
                <>
                {recentComplaints.map((complaint)=>{
                    return(
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
                        <button className="bg-blue-700 text-white p-3 rounded-2xl border-2 text-sm">view Details</button>
                                
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
        <div className="p-10">

            <div className="header mb-10">
                <p className="text-3xl font-bold" id="header">Dashboard</p>
                <label htmlFor="header" className="opacity-50">Track your complaints securely</label>
            </div>


            <div className="flex gap-6 justify-center mb-10">
                <div className="flex rounded-2xl border-2 gap-2.5 p-2 w-1/5">
                    <p>icon</p>
                    <div>
                        <p id="countTotal">Total Complaints</p>
                        <label htmlFor="countTotal">{complaint.length}</label>
                    </div>
                </div>

                <div className="flex rounded-2xl border-2 gap-2.5 p-2 w-1/5">
                    <p>icon</p>
                    <div>
                        <p id="countPending">Pending</p>
                        <label htmlFor="countPending">implement pending</label>
                    </div>
                </div>

                <div className="flex rounded-2xl border-2 gap-2.5 p-2 w-1/5">
                    <p>icon</p>
                    <div>
                        <p id="countProgress">In Progress</p>
                        <label htmlFor="countProgress">implement prog</label>
                    </div>
                </div>

                <div className="flex rounded-2xl border-2 gap-2.5 p-2 w-1/5">
                    <p>icon</p>
                    <div>
                        <p id="countResolved">Total Complaints</p>
                        <label htmlFor="countResolved">implement resolved</label>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-3.5">
                    <p className="font-bold text-2xl">Recent complaints</p>
                    <button className="rounded-2xl bg-blue-700 text-white p-4"> Raise New Complaint</button>
                </div>

            </div>

            {handelRecentComplaints()}

        </div>
    )
}