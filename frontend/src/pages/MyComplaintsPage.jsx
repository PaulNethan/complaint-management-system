import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


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
            currentObj.complaint_type.toLowerCase().includes(search.toLowerCase())
        )
    })

    const myComplaints = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/api/user/viewcomplaints/", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setComplaints(data.all_complaint_details);
    }
    useEffect(()=>{
        myComplaints();
    },[]);


    return (
        <div className="bg-yellow-800 h-full p-6">

            <div className="header">
                <h2 className="text-2xl font-bold " id="header">My Complaints</h2>
                <label htmlFor="header" className="opacity-50">Track and manage your reported incidents</label>
            </div>


            <div className="">

                <div className="container_for_search_and_filter flex justify-between gap-8">
                    <input className="w-3/4" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search by title or id" />
                    <select defaultValue="">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="inprogress">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <table className="bg-red-600 w-full">

                    <thead className="bg-yellow-50">

                        <tr>
                            <th className="opacity-50">ID</th>
                            <th className="opacity-50">TITLE</th>
                            <th className="opacity-50">CATEGORY</th>
                            <th className="opacity-50">PRIORITY</th>
                            <th className="opacity-50">DATE</th>
                            <th className="opacity-50">STATUS</th>
                            <th className="opacity-50">ACTION</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredComplaints.map((currentObj) => {
                            return(

                            <tr key={currentObj.id}>

                                <td className="opacity-50">#{currentObj.id}</td>
                                <td>{currentObj.complaint_type} Report - {currentObj.incident_date}</td>
                                <td className="opacity-50">{currentObj.complaint_type}</td>
                                <td className={handelPriority(currentObj.severity_level)}>{handelPriority(currentObj.severity_level)}</td>
                                <td className="opacity-50">{currentObj.incident_date}</td>
                                <td className="bg-blue-500">Pending</td>
                                <td>
                                    <Link to={`/user/complaint/${currentObj.id}`} state={currentObj}>
                                        view
                                    </Link>
                                </td>

                            </tr>
                            )

                        })}

                    </tbody>


                </table>
            </div>

        </div>
    )
} 