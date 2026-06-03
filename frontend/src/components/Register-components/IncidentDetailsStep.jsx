import { Input } from "../ui/input";

export default function IncidentDetailsStep({ details, onChange }) {
    return (
        <div className="bg-[#FFFFFF] flex flex-col space-y-5 p-5">
            <p className="text-xl font-medium border-b ">Incident Details</p>

            <div className="flex flex-col space-y-5">

                <div className="flex flex-row gap-3 w- justify-between">
                    <div className="flex-1">
                        <label htmlFor="date" className="font-medium">Date of incident*</label> <br />
                        <Input
                            id="date"
                            type="date"
                            value={details.incident_date}
                            onChange={onChange}
                            name="incident_date"
                            className="opacity-80 p-2"
                        />

                    </div>

                    <div className="flex-1">
                        <label htmlFor="time" className="font-medium">Time of incident</label> <br />
                        <Input
                            id="time"
                            type="time"
                            value={details.incident_time}
                            name="incident_time"
                            onChange={onChange}
                        />
                    </div>
                </div>


                <div className="flex flex-col">
                    <label htmlFor="location" className="font-medium">Location of incident*</label>
                    <Input
                        id="location"
                        type="text"
                        placeholder="Full address or a description of the location."
                        value={details.incident_location}
                        name="incident_location"
                        onChange={onChange}
                        className="text-sm p-4 opacity-80"
                    />
                </div>


                <div className="flex items-center gap-3 p-4 rounded-2xl border border-[#FEF3C6] bg-[#FFFBEB] ">
                    <Input
                        type="checkbox"
                        checked={details.on_going}
                        onChange={onChange}
                        name="on_going"
                        className="w-5 h-5"
                    />
                    <span>Is this incident ongoing right now?</span>
                </div>
            </div>
        </div>
    )
}