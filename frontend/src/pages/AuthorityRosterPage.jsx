import { useEffect } from "react"
import { useState } from "react"
import React from "react"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function AuthorityProfilePage() {

    const token = localStorage.getItem("token")
    const [role, setRole] = useState("police")
    const [authorities, setAuthorities] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState(null)
    const [filter, setFilter] = useState("")

    const filteredAuthorities = authorities.filter((auth) => {
        return auth.email.toLowerCase().includes(filter.toLowerCase())
    })




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
        <div className="main min-w-dvh w-full flex flex-col space-y-8  m-9">
            <div>
                <header id="header" className="text-white font-medium text-2xl" >authority roster page</header>
                <label htmlFor="header" className="text-white">Revoke authority access / remove complaints </label>
            </div>

            <CardHeader className="flex gap-6">
                <Input placeholder="filter" className="bg-[#151515] w-4/5 text-white p-3.5" value={filter} onChange={(e) => setFilter(e.target.value)}></Input>

                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-[#151515] w-1/5 text-white">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#151515] text-white">

                        <SelectItem value="police" >Police</SelectItem>
                        <SelectItem value="cyber_crime" >Cyber Crime</SelectItem>
                    </SelectContent>


                </Select>

            </CardHeader>

            <CardContent className="border border-zinc-800 rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-[#0A0A0A]">
                            <TableHead className="text-white font-medium ">id</TableHead>
                            <TableHead className="text-white font-medium ">Authority Type</TableHead>
                            <TableHead className="text-white font-medium ">Email</TableHead>
                            <TableHead className="text-white font-medium ">phone no</TableHead>
                            <TableHead className="text-white font-medium ">View Complaints</TableHead>
                            <TableHead className="text-white font-medium ">Remove Authority</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuthorities.map((authority) => (
                            <React.Fragment key={authority.id}>
                                <TableRow className="text-white border-zinc-800 hover:bg-[#0A0A0A]">
                                    <TableCell>{authority.id}</TableCell>
                                    <TableCell>{authority.authority_type}</TableCell>
                                    <TableCell>{authority.email}</TableCell>
                                    <TableCell>0800850640550</TableCell>
                                    <TableCell><Button type="button" onClick={async () => {
                                        if (selectedAuth === authority.id) {
                                            setSelectedAuth(null);
                                            setComplaints([]);
                                        } else {
                                            await getComplaints(authority.id);
                                        }
                                    }}>{selectedAuth === authority.id ? "Close" : "View Complaints"}
                                    </Button>
                                    </TableCell>
                                    <TableCell><Button type="button" onClick={async () => { await handlebanauth(authority.id) }}>Remove Authority</Button></TableCell>
                                </TableRow>
                                {selectedAuth === authority.id && (
                                    <TableRow className="text-white border-zinc-800 hover:bg-[#0A0A0A]">
                                        <TableCell colSpan="6">
                                            <div>
                                                <h4 className="text-white font-bold text-xl p-5 text-center">Assigned complaints</h4>
                                                {complaints.length === 0 ? (<p className="text-white">No assigned complaints</p>) : (
                                                    <ul>
                                                        {complaints.map((c) => (
                                                            <li key={c.id}>
                                                                <p>{c.complaint_type} - {c.complaint_status}</p>
                                                                <Button type="button" onClick={() => handleRemoveComplaint(c.id)}>Remove Complaint</Button>

                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>


                                )}

                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </div >
    )
}