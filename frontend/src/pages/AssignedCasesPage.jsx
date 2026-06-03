import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, CirclePlay, CircleCheckBig } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHeader, TableRow, TableBody } from "@/components/ui/table";



export default function AssignedComplaintsPage() {

    const token = localStorage.getItem("token");
    const [complaints, setComplaints] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    let filtered_complaints = complaints;

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
        <div className="main min-h-vh flex flex-col space-y-8  p-9 bg-[#F7F8FC]">
            <div className="flex flex-col">
                <p id="header" className="font-bold text-2xl">My assigned complaints</p>
                <label htmlFor="header" className="opacity-50 text-sm">Track your complaints securely</label>
            </div>

            {/* BADGES */}
            {/* Parent Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">

                {/* BADGE 1: TOTAL COMPLAINTS */}
                <Card
                    onClick={() => setActiveTab("all")}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-row items-center gap-4 cursor-pointer hover:border-slate-200 transition-all text-left"
                >
                    {/* Left Side: Icon Box */}
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5" />
                    </div>
                    {/* Right Side: Info Stack */}
                    <div className="flex flex-col items-start">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Complaints</span>
                        <span className="text-2xl font-bold text-slate-900 mt-1">{complaints.length}</span>
                    </div>
                </Card>

                {/* BADGE 2: PENDING COMPLAINTS */}
                <Card
                    onClick={() => setActiveTab("pending")}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-row items-center gap-4 cursor-pointer hover:border-slate-200 transition-all text-left"
                >
                    {/* Left Side: Icon Box */}
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5" />
                    </div>
                    {/* Right Side: Info Stack */}
                    <div className="flex flex-col items-start">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Complaints</span>
                        <span className="text-2xl font-bold text-slate-900 mt-1">{pending_complaints.length}</span>
                    </div>
                </Card>

                {/* BADGE 3: IN PROGRESS */}
                <Card
                    onClick={() => setActiveTab("in_progress")}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-row items-center gap-4 cursor-pointer hover:border-slate-200 transition-all text-left"
                >
                    {/* Left Side: Icon Box */}
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CirclePlay className="h-5 w-5" />
                    </div>
                    {/* Right Side: Info Stack */}
                    <div className="flex flex-col items-start">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">In Progress</span>
                        <span className="text-2xl font-bold text-slate-900 mt-1">{in_progress.length}</span>
                    </div>
                </Card>

                {/* BADGE 4: RESOLVED */}
                <Card
                    onClick={() => setActiveTab("resolved")}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-row items-center gap-4 cursor-pointer hover:border-slate-200 transition-all text-left"
                >
                    {/* Left Side: Icon Box */}
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CircleCheckBig className="h-5 w-5" />
                    </div>
                    {/* Right Side: Info Stack */}
                    <div className="flex flex-col items-start">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Resolved Complaints</span>
                        <span className="text-2xl font-bold text-slate-900 mt-1">{resolved.length}</span>
                    </div>
                </Card>

            </div>
            <Card>

                <Table className="">
                    <TableHeader className="font-medium">
                        <TableRow>
                            <TableCell >ID</TableCell>
                            <TableCell >REPORTER</TableCell>
                            <TableCell >TITLE & CATEGORY</TableCell>
                            <TableCell >PRIORITY</TableCell>
                            <TableCell >DATE</TableCell>
                            <TableCell >STATUS</TableCell>
                            <TableCell >TAKE COMPLAINT</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered_complaints.map((c) => (
                            <TableRow key={c.id} >
                                <TableCell className=" opacity-50">#{c.id}</TableCell>
                                <TableCell >
                                    <div>
                                        <p >hard user name</p>
                                        <p >{c.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell >{c.complaint_type} Report - {c.incident_date}</TableCell>
                                <TableCell >{c.severity_level}</TableCell>
                                <TableCell className="opacity-50">{c.incident_date}</TableCell>
                                <TableCell >{c.complaint_status}</TableCell>
                                <TableCell >
                                    <Link to={`/authority/AssignedCasePage/${c.id}`} state={c}>
                                        <Button type="button" variant="outline">View Details</Button>
                                    </Link>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

        </div>
    );
}
