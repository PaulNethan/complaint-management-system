import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { SelectItem, SelectValue, SelectContent, Select, SelectTrigger } from "@/components/ui/select";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export default function MyComplaintsPage() {

    const [complaints, setComplaints] = useState([])
    const [search, setSearch] = useState("")


    /*the below part is used to check the severity level so we can use the data to display it in the priority column*/
    const handelPriority = (severityLevel) => {
        if (severityLevel === "low") {
            return "bg-green-500 text-green-800"
        } else if (severityLevel === "medium") {
            return "bg-yellow-500 text-yellow-800"
        } else if (severityLevel === "high")
            return "bg-red-500 text-red-800"
    }


    /* the below part is used to filter and send either a filtered list from the search or the entire complaint list  */
    const filteredComplaints = complaints.filter((currentObj) => {
        if (search === "") {
            return true
        }
        return (
            currentObj.complaint_type.toLowerCase().includes(search.toLowerCase()) || currentObj.complaint_status.toLowerCase().includes(search.toLowerCase())
        )
    })

    const myComplaints = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/api/user/viewcomplaints/", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (response.status === 429) {
            const error = await response.json()
            alert(`submission blocked: ${error.details || 'Too many requests. Please wait.'}`)
            return
        }
        const data = await response.json()
        setComplaints(data.all_complaint_details);
    }
    useEffect(() => {
        myComplaints();
    }, []);


    return (
        <div className="min-h-screen p-8  space-y-6 bg-[#F7F8FC]">

            <div className="header ">
                <h2 className="text-2xl font-bold " id="header">My Complaints</h2>
                <label htmlFor="header" className="opacity-50">Track and manage your reported incidents</label>
            </div>


            <div className="">

                <Card >
                    <div className=" flex flex-row  mx-auto w-full p-2 gap-2.5">


                        <Input className="flex-46" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search by title or id" />
                        <Select value={search} onValueChange={(val) => setSearch(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>


                            <SelectContent>



                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table >

                        <TableHeader className="">

                            <TableRow className="font-bold rounded-2xl">
                                <TableHead className="font-semibold text-sm">ID</TableHead>
                                <TableHead className="font-semibold text-sm">TITLE</TableHead>
                                <TableHead className="font-semibold text-sm">CATEGORY</TableHead>
                                <TableHead className="font-semibold text-sm">PRIORITY</TableHead>
                                <TableHead className="font-semibold text-sm">DATE</TableHead>
                                <TableHead className="font-semibold text-sm">STATUS</TableHead>
                                <TableHead className="font-semibold text-sm">ACTION</TableHead>
                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {filteredComplaints.map((currentObj) => {
                                return (

                                    <TableRow key={currentObj.id}>

                                        <TableCell className="opacity-50">#{currentObj.id}</TableCell>
                                        <TableCell>{currentObj.complaint_type} Report - {currentObj.incident_date}</TableCell>
                                        <TableCell className="opacity-50">{currentObj.complaint_type}</TableCell>
                                        <TableCell className="p-2">{currentObj.severity_level}</TableCell>
                                        <TableCell className="opacity-50">{currentObj.incident_date}</TableCell>
                                        <TableCell >
                                            <Badge variant="secondary">
                                                {currentObj.complaint_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline">

                                                <Link to={`/user/complaint/${currentObj.id}`} state={currentObj}>
                                                    view Details
                                                </Link>
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                )

                            })}

                        </TableBody>


                    </Table>
                </Card>

            </div>

        </div>
    )
} 