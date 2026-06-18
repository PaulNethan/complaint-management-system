import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { SelectItem, SelectValue, SelectContent, Select, SelectTrigger } from "@/components/ui/select";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/services/api";


export default function MyComplaintsPage() {

    const [complaints, setComplaints] = useState([])
    const [search, setSearch] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [form_data, Setformdata] = useState({
        draft_post_ai: "",
        manual_complaint_draft: "",
        safety_issue_ai: null,
        auditor_notes_ai: "",
    })
    const [step, setstep] = useState(0);

    const setter = (event) => {
        const { name, value } = event.target;
        Setformdata((current) => ({
            ...current,
            [name]: value,
        }))
    }

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

        const response = await apiFetch("/api/user/viewcomplaints/", {
            method: "GET",
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


    {/* send complaint id and token
    receive the draft
    */}
    const draft_post = async () => {
        const response = await apiFetch("/api/user/draft_post/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                complaint_id: selectedComplaintId
            })
        })

        if (response.ok) {
            const data = await response.json()
            Setformdata({
                ...form_data,
                draft_post_ai: data.draft_post_ai,
                safety_issue_ai: data.safety_issue_ai,
                auditor_notes_ai: data.auditor_notes_ai,
            })
            console.log(data.draft_post_ai)
            console.log(data.safety_issue_ai)
            console.log(data.auditor_notes_ai)
            setstep(2);
        } else {
            const error = await response.json()
            alert(`${error.details || 'Failed to generate draft post'}`)
        }
    }

    const handleSubmitPost = async () => {
        const response = await apiFetch("/api/user/submit_post/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                draft_post: form_data.draft_post_ai,
                complaint_id: selectedComplaintId

            })
        })
        if (response.ok) {
            const data = await response.json()
            setIsModalOpen(!isModalOpen)
            console.log(data.message)
            alert(data.message)
        } else {
            const error = await response.json()
            alert(`${error.details || 'Failed to generate draft post'}`)
        }

    }

    const handeldialog = () => {

        return (
            <div>
                {step === 0 && (
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Button type="button" onClick={() => { setstep(2); Setformdata({ ...form_data, draft_post_ai: "" }) }}>Craft the post (Manual)</Button>
                        <Button type="button" onClick={() => { setstep(1); draft_post(selectedComplaintId) }}>Use ai to write post</Button>
                    </div>
                )}
                {step === 1 && (
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-sm text-muted-foreground animate-pulse">
                            AI is drafting your post...
                        </p>
                    </div>
                )}
                {step === 2 && (
                    <div>

                        <div className="flex flex-row items-center justify-center gap-2">
                            <Textarea value={form_data.draft_post_ai} onChange={(e) => Setformdata({ ...form_data, draft_post_ai: e.target.value })} />
                        </div>
                        <div>
                            <Button type="button" onClick={handleSubmitPost}>Post</Button>
                        </div>
                    </div>

                )}
            </div>
        )
    }
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
                                <TableHead className="font-semibold text-sm">POST</TableHead>
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

                                        <TableCell>
                                            <Button type="button" variant="secondary" onClick={() => { setSelectedComplaintId(currentObj.id); setIsModalOpen(!isModalOpen); setstep(0) }}>
                                                GO PUBLIC
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                )

                            })}

                        </TableBody>


                    </Table>
                </Card>

            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Go Public
                        </DialogTitle>
                        <DialogDescription>
                            Choose how you want to draft your public safety post.
                        </DialogDescription>
                    </DialogHeader>
                    {handeldialog()}
                </DialogContent>

            </Dialog>

        </div>
    )
} 