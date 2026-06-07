import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TableCell, TableHeader, Table, TableRow, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export default function AvailableComplaintsPage() {

    const token = localStorage.getItem("token");
    const [complaints, setComplaint] = useState([]);
    const [searchFilter, setSearchFilter] = useState("")

    //time:0

    const getComplaints = async () => {
        const response = await fetch(window.API_BASE_URL + "/api/user/cmp_details_for_auth/", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json();
        if (response.ok) {
            console.log(data.complaints);
            setComplaint(data.complaints);
        }
        else {
            console.log(data.messages);
        }

    }
    useEffect(() => {
        getComplaints();
    }, [])

    //onchange time x
    const filteredComplaints = complaints.filter((currentObj) => {
        if (searchFilter === "") {
            return true
        }
        return (
            currentObj.complaint_type.toLowerCase().includes(searchFilter.toLowerCase())
        )
    })

    //onclick time x take complaints
    const TakeComplaints = async (complaint_id) => {

        const response = await fetch(window.API_BASE_URL + "/api/user/assign_complaints/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                complaint_id: complaint_id
            })

        })
        const data = await response.json();
        console.log(data)

    }


    return (
        <div className="main min-h-vh w-vh flex flex-col space-y-8  p-9 bg-[#F7F8FC]">


            <div className="flex flex-col">
                <p id="header" className="font-bold text-2xl">Available complaints page</p>
                <label htmlFor="header" className="opacity-50 text-sm">View all the available complaints </label>
            </div>




            <Card className="flex flex-row p-3">
                <Input type="text" placeholder="Filter complaints by search " className=" w-4/5" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />

                <Select value={searchFilter} onValueChange={setSearchFilter} className="w-1/5">

                    <SelectTrigger>
                        <SelectValue placeholder="status" />
                    </SelectTrigger>
                    <SelectContent>

                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inprogress">In progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={searchFilter} onValueChange={setSearchFilter} className="w-1/5">
                    <SelectTrigger>
                        <SelectValue placeholder="priority" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
            </Card>


            <Table className="bg-[#FFFFFF] rounded-2xl overflow-clip">

                <TableHeader >
                    <TableRow className="font-bold">
                        <TableHead className="opacity-50">ID</TableHead>
                        <TableHead className="opacity-50">REPORTER</TableHead>
                        <TableHead className="opacity-50">TITLE & CATEGORY</TableHead>
                        <TableHead className="opacity-50">PRIORITY</TableHead>
                        <TableHead className="opacity-50">DATE</TableHead>
                        <TableHead className="opacity-50">STATUS</TableHead>
                        <TableHead className="opacity-50">TAKE COMPLAINT</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>

                    {filteredComplaints.map((currentObj) => {
                        return (

                            <TableRow key={currentObj.id}>
                                <TableCell className="p-2">#{currentObj.id}</TableCell>
                                <TableCell className="p-2">
                                    <div>
                                        <p className="p-2">hard user name</p>
                                        <p className="p-2">{currentObj.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="p-2">{currentObj.complaint_type} Report - {currentObj.incident_date}</TableCell>
                                <TableCell className="p-2">{currentObj.severity_level}</TableCell>
                                <TableCell className="p-2">{currentObj.incident_date}</TableCell>
                                <TableCell className="p-2">{currentObj.complaint_status}</TableCell>
                                <TableCell className="p-2">
                                    <Button type="button" onClick={async () => { await TakeComplaints(currentObj.id); await getComplaints() }}>Take Complaint</Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>

            </Table>



        </div>
    )
}