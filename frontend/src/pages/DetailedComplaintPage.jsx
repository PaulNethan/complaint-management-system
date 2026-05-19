import { useLocation, useNavigate } from "react-router-dom"

export default function detailedComplaint() {
    const location = useLocation();
    const navigate = useNavigate();
    const complaint = location.state;
    return (
        <div className="mx-44 my-10">

            <div className="header flex mb-8">
                <button type="button" onClick={() => navigate(-1)}>⬅</button>
                <div>
                    <p id="id" className="text-3xl font-bold">Complaint Details</p>
                    <label htmlFor="id" className="opacity-50">#{complaint.id}</label>
                </div>
            </div>

            <div className="container flex gap-6 bg-amber-50 justify-around">

                <div className="detailed_description">
                    <div className="flex">
                        <p className="font-bold text-2xl ">{complaint.complaint_type} Report - {complaint.incident_date}</p>
                        <p>pending</p>
                    </div>
                    <div className="flex">
                        <p>date_icon {complaint.incident_date}</p>
                        <p>loca_icon {complaint.incident_location}</p>
                    </div>
                    <div className="flex">
                        <p>assu_icon {complaint.complaint_type}</p>
                        <p>emer_icon {complaint.severity_level}</p>
                    </div>

                    <label htmlFor="description">Description</label>
                    <div id="description">
                        <p>{complaint.detailed_description}</p>
                    </div>

                </div>


                <div className="status_timeline">

                    <p>Status Timeline</p>

                    <div>

                        <div className="flex">

                            <div>
                                icon1
                            </div>

                            <div>
                                <p>Submitted</p>
                                <p>Complaint received</p>
                            </div>

                        </div>

                        <div className="flex">

                            <div>
                                icon2
                            </div>

                            <div>
                                <p>In Progress</p>
                                <p>Investigation ongoing</p>
                            </div>

                        </div>

                        <div className="flex">

                            <div>
                                icon3
                            </div>

                            <div>
                                <p>Resolved</p>
                                <p>Action taken</p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}