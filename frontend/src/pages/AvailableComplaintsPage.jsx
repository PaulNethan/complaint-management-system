import { useEffect, useState } from "react"

export default function AvailableComplaintsPage() {

    const token = localStorage.getItem("token");
    const [complaints, setComplaint] = useState([]);
    const [searchFilter, setSearchFilter] = useState("")

    //time:0
    useEffect(() => {
        const getComplaints = async () => {
            const response = await fetch("http://127.0.0.1:8000/api/user/cmp_details_for_auth/", {
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

        const response = await fetch("http://127.0.0.1:8000/api/user/assign_complaints/", {
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
        <div className="mx-24">

            <div>
                <div className="my-6">
                    <p id="header" className="font-bold text-2xl">available complaints page</p>
                    <label htmlFor="header" className="opacity-50">View all the available complaints </label>
                </div>



                <div>
                    <div className="flex mb-6">
                        <input type="text" placeholder="Filter complaints by search " className="bg-amber-50 w-4/5" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />

                        <select className="w-1/5" defaultValue="" onChange={(e) => setSearchFilter(e.target.value)}>
                            <option value="">All status</option>
                            <option value="pending">Pending</option>
                            <option value="inprogress">In progress</option>
                            <option value="resolved">Resolved</option>
                        </select>

                        <select className="w-1/5" defaultValue="" onChange={(e) => setSearchFilter(e.target.value)}>
                            <option value="">All priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>


                    <table>

                        <thead>
                            <tr>
                                <th className="opacity-50">ID</th>
                                <th className="opacity-50">REPORTER</th>
                                <th className="opacity-50">TITLE & CATEGORY</th>
                                <th className="opacity-50">PRIORITY</th>
                                <th className="opacity-50">DATE</th>
                                <th className="opacity-50">STATUS</th>
                                <th className="opacity-50">TAKE COMPLAINT</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredComplaints.map((currentObj) => {
                                return (

                                    <tr key={currentObj.id}>
                                        <td className="p-2">#{currentObj.id}</td>
                                        <td className="p-2">
                                            <div>
                                                <p  className="p-2">hard user name</p>
                                                <p className="p-2">{currentObj.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-2">{currentObj.complaint_type} Report - {currentObj.incident_date}</td>
                                        <td className="p-2">{currentObj.severity_level}</td>
                                        <td className="p-2">{currentObj.incident_date}</td>
                                        <td className="p-2">{currentObj.complaint_status}</td>
                                        <td className="p-2">
                                            <button type="button" onClick={() => TakeComplaints(currentObj.id)}>Take Complaint</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    )
}