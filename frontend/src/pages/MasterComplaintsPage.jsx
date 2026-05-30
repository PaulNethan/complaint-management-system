import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { act } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function MasterComplaintsPage() {

    const [role, setRole] = useState("police")
    const token = localStorage.getItem("token")
    const [complaints, setComplaints] = useState([])
    const [ActiveTab, setActiveTab] = useState("unassigned")
    const unassigned = complaints.filter((c) => c.assigned_to == null)
    const assigned = complaints.filter((c) => c.assigned_to !== null)
    const [authority, setauthority] = useState([])
    const [filter, setFilter] = useState("")

    const filteredComplaints = ActiveTab === "unassigned" ? unassigned : assigned
        .filter((complaint) => {
            return complaint.complaint_type.toLowerCase().includes(filter.toLowerCase()) ||
                complaint.complaint_status.toLowerCase().includes(filter.toLowerCase()) ||
                complaint.complaint_type.toLowerCase().includes(filter.toLowerCase())
        })

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
        <div className="main min-w-dvh w-full flex flex-col space-y-8  m-9">
            <header className="text-white font-medium text-2xl ">Master Complaint Log ({role})</header>
            <Card className="bg-[#0A0A0A] space-x-10 space-y-4">

                <CardHeader className="flex gap-6">
                    <Input placeholder="filter" className="bg-[#151515] w-4/5 " value={filter} onChange={(e) => setFilter(e.target.value)}></Input>

                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="bg-[#151515] w-1/5 text-white">
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>

                        <SelectContent className="bg-[#151515] text-white">

                            <SelectItem value="police" >Police</SelectItem>
                            <SelectItem value="cyber_crime" >Cyber Crime</SelectItem>
                        </SelectContent>


                    </Select>


                    <Select value={ActiveTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="bg-[#151515] w-1/5 text-white">
                            <SelectValue placeholder="Complaint Type" />
                        </SelectTrigger>

                        <SelectContent className="bg-[#151515] text-white">
                            <SelectItem value="unassigned">unassigned</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                        </SelectContent>

                    </Select>

                </CardHeader>


                <CardContent className="border border-zinc-800 rounded-2xl overflow-hidden">


                    <Table className="text-white">
                        <TableHeader className="text-white">
                            <TableRow className="border-zinc-800 hover:bg-[#0A0A0A]">
                                <TableHead className="text-white">ID</TableHead>
                                <TableHead className="text-white">Type</TableHead>
                                <TableHead className="text-white">Severity</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white">{ActiveTab === "unassigned" ? "Action" : "Assigned To"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ActiveTab === "unassigned" ? (
                                filteredComplaints.map((c) => (
                                    <TableRow key={c.id} className="border-zinc-800 hover:bg-[#0A0A0A]">
                                        <TableCell className="text-white">{c.id}</TableCell>
                                        <TableCell className="text-white">{c.complaint_type}</TableCell>
                                        <TableCell className="text-white">{c.severity_level}</TableCell>
                                        <TableCell className="text-white">{c.complaint_status}</TableCell>
                                        <TableCell className="text-white">
                                            <select onChange={(e) => handelassign(e.target.value, c.id)}>
                                                <option value="">Assign officer</option>
                                                {authority.map((current) => (
                                                    <option value={current.id} key={current.id}>{current.id}</option>

                                                ))}
                                            </select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredComplaints.map((c) => (
                                    <TableRow key={c.id} className="border-zinc-800 hover:bg-[#0A0A0A]">
                                        <TableCell className="text-white">{c.id}</TableCell>
                                        <TableCell className="text-white">{c.complaint_type}</TableCell>
                                        <TableCell className="text-white">{c.severity_level}</TableCell>
                                        <TableCell className="text-white">{c.complaint_status}</TableCell>
                                        <TableCell className="text-white">User ID: {c.assigned_to}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}