import { useEffect, useState } from "react"

export default function AvilableComplaintsPage() {

    const token = localStorage.getItem("token");
    const [complaints, setcomplaint] = useState([]);
    const [filter, setfilter] = useState("")

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
                setcomplaint(data.auth_complaint);
            }
            else {
                console.log(data.messages);
            }

        }
        getComplaints();
    }, [])

    //onchange time x
    const filteredComplaints = complaints.filter((currentObj) => {
        if (filter === "") {
            return true
        }
        return (
            currentObj.complaint_type.toLowerCase().includes(filter.toLowerCase())
        )
    })

    //onclick time x


    return (
        <div className="p-24 h-full">
            <p id="header">avilabel complaints page</p>
            <br />
            <label htmlFor="header">View all the avilabel complaints </label>

            <div className="p-7">
                <div className="flex">
                    <input type="text" value={filter} onChange={(e) => setfilter(e.target.value)} />

                    <select defaultValue="" onChange={(e) => setfilter(e.target.value)}>
                        <option value="">All status</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In progress</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select defaultValue="" onChange={(e) => setfilter(e.target.value)}>
                        <option value="">All priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <table className="w-full">

                        <thead>
                            <tr>
                                <th>
                                    <th className="opacity-50">ID</th>
                                    <th className="opacity-50">REPORTER</th>
                                    <th className="opacity-50">TITLE & CATEGORY</th>
                                    <th className="opacity-50">PRIORITY</th>
                                    <th className="opacity-50">DATE</th>
                                    <th className="opacity-50">STATUS</th>
                                    <th className="opacity-50">TAKE COMPLAINT</th>
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredComplaints.map((currentObj) => {
                                return (

                                    <tr key={currentObj.id}>
                                        <td>#{currentObj.id}</td>
                                        <td>
                                            <div>
                                                <p id="p">hard user name</p>
                                                <label htmlFor="p">{currentObj.email}</label>
                                            </div>
                                        </td>
                                        <td>{currentObj.complaint_type} Report - {currentObj.incident_date}</td>
                                        <td>{currentObj.severity_level}</td>
                                        <td>{currentObj.incident_date}</td>
                                        <td>
                                            <button type="button">Take Complaint</button>
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