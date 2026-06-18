import { useState, useEffect } from "react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    Select, SelectItem, SelectContent, SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";



export default function PendingApprovalsPage() {


    const [role, setRole] = useState("police");
    const [authority, setAuthority] = useState([]);
    const [filter, setFilter] = useState("")

    const filteredAuthorities = authority.filter((auth) => {
        return auth.email.toLowerCase().includes(filter.toLowerCase())
    })

    const getAuthorities = async () => {
        const response = await apiFetch("/api/pendingauthority/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ department: role })
        })
        if (response.ok) {
            const data = await response.json()
            console.log("Fetched data for:", role, data.message)
            setAuthority(data.message)
        }
    }
    useEffect(() => {
        getAuthorities();
    }, [role])


    const handleAccess = async (authId) => {
        const response = await apiFetch("/api/authority/approveauthority/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: authId })
        })
        if (response.ok) {
            const data = await response.json()
            alert(data.message)
            console.log("data", data.message)
        }
        else {
            try {
                const data = await response.json()
                alert(data.message || "An error occurred.")
            } catch (error) {
                console.error("Failed to parse error response:", error);
                alert(`Request failed with status: ${response.status}`);
            }
        }
        getAuthorities();
    }
    return (
        <div className="main min-w-dvh w-full flex flex-col space-y-8  m-9">
            <header>
                <h1 id="header" className="text-white font-medium text-2xl ">Pending Approvals page</h1>
                <label htmlFor="header" className="opacity-50 text-white">Review and approve pending authority registrations</label>
            </header>

            <Card className="bg-[#0A0A0A] space-x-10 space-y-4">
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
                    <Table className="text-white ">
                        <TableHeader className="text-white ">
                            <TableRow className="border-zinc-800 hover:bg-[#0A0A0A]">
                                <TableHead className="text-white font-medium ">Name</TableHead>
                                <TableHead className="text-white font-medium">Email</TableHead>
                                <TableHead className="text-white font-medium">Phone</TableHead>
                                <TableHead className="text-white font-medium">activate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>


                            {filteredAuthorities.map((auth) => (
                                <TableRow key={auth.id} className="hover:bg-[#0A0A0A]">
                                    <TableCell>{auth.name}</TableCell>
                                    <TableCell>{auth.email}</TableCell>
                                    <TableCell>hard 9876543210</TableCell>
                                    <TableCell><Button type="button" onClick={() => handleAccess(auth.id)}>Grant Access</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>

            </Card>
        </div>
    )
}