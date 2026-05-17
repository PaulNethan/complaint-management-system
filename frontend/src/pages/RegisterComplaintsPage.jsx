import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterComplaintsPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1)
    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)
    const [complaintType, setComplaintType] = useState("")
    const [severityLevel, setSeverityLevel] = useState("")
    const [urgentChB, setUrgentChB] = useState(false)
    const [sosChB, setSosChB] = useState(false)
    const [authorityContact, setAuthorityContact] = useState(false)
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [onGoingCheckBox, setOnGoingCheckBox] = useState(false)
    const [location, setLocation] = useState("")
    const [victimCheckBox, setVictimCheckBox] = useState(false)
    const [victimName, SetVictimName] = useState("")
    const [victimContact, setVictimContact] = useState("")
    const [accusedName, setAccusedName] = useState("")
    const [relationshipToVictim, setRelationShipToVictim] = useState("")
    const [victimPhysicalDescription, setVictimPhysicalDescription] = useState("")
    const [victimLocation, setVictimLocation] = useState("")
    const [detailedComplaint, setDetailedComplaint] = useState("")
    const [evidence, setEvidence] = useState([])


    const handelSubmitComplaints = () =>{
        console.log("current step:", step)
        console.log("chosen date:", date)
        console.log("chosen time:", time)
        console.log("on going check box value:", onGoingCheckBox)
        console.log("chosen location:", location)
        console.log("chosen victim checkbox data:", victimCheckBox)
        console.log("victim Name:",victimName)
        console.log("victim contact number or email",victimContact)
        console.log("accused name :", accusedName)
        console.log("relationship to victim:",relationshipToVictim)
        console.log("victim physical description:", victimPhysicalDescription)
        console.log("victim location:",victimLocation)
        console.log("detailed complaint :",detailedComplaint)
        console.log("uploaded evidence:",evidence)
        console.log("complaint type:", complaintType)
        console.log("severity level :", severityLevel)
        console.log("urgent check box value", urgentChB)
        console.log("sos check box value:",sosChB)
        console.log("authority contact check box value:",authorityContact)
        nextStep()

    }

    const handelFileUpload = (e) => {

        if (e.target.files && e.target.files.length > 0) {
            setEvidence(Array.from(e.target.files))
        }
    }
    const handelBackNext = () => {
        return (
            <div className="flex justify-between">
                {
                    step > 1 && 
                        <button type="button" className="mx-24 my-8" onClick={prevStep}>Back</button>
                    
                }
                {
                    step === 5 ?
                        <button type="submit" className="mx-24 my-8" onClick={handelSubmitComplaints}>Submit formal Complaint</button>
                        :
                        <button type="button" className="mx-24 my-8" onClick={nextStep}>Next Step </button>


                }
            </div>
        )
    }
    const collectComplaintDetails = () => {
        switch (step) {
            case 1:
                return (
                    <div className="m-20 bg-amber-500 p-5">

                        <p>Complaint Classification</p>

                        <select defaultValue="" onChange={(e)=>setComplaintType(e.target.value)}>
                            <option value="">Select Complaint Type</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Cyber">cyber Security</option>
                            <option value="Domestic violence">Domestic violence</option>
                            <option value="Stalking">Stalking</option>
                            <option value="assault">Assault</option>
                            <option value="workspaceHarassment">workspace Harassment</option>



                        </select>

                        <select defaultValue="" onChange={(e)=> setSeverityLevel(e.target.value)}>
                            <option value="">Select Severity Level</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">high</option>
                        </select>

                        {handelBackNext()}

                    </div>
                );


            case 2:
                return (
                    <div className="m-20 bg-amber-500 p-5">
                        <p>Incident Details</p>

                        <div>
                            <input type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)} />

                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                            <br />
                            <input type="text" placeholder=" Enter location" value={location} onChange={(e) => setLocation(e.target.value)} />
                            <br />
                            <label>
                                <input type="checkbox" checked={onGoingCheckBox} onChange={() => setOnGoingCheckBox(!onGoingCheckBox)} />
                                <span>Is this incident ongoing right now?</span>
                            </label>
                        </div>

                        {handelBackNext()}

                    </div>
                );

            case 3:
                return (
                    <div className="m-20 bg-amber-500 p-5">
                        <p>Victim Information</p>
                        <div>
                            <input type="checkbox" id="victimCheck" checked={victimCheckBox} onChange={() => setVictimCheckBox(!victimCheckBox)} />
                            <label htmlFor="victimCheck">
                                I am the victim in this incident
                            </label>
                            {victimCheckBox === false ?
                                <div>
                                    <div className=" flex gap-9">
                                        <div className="my-6">
                                            <label htmlFor="victimName">Victim's Name (Optional)</label>
                                            <br />
                                            <input type="text" id="victimName" placeholder="Leave blank if unknown or anonymous" value={victimName} onChange={(e) => SetVictimName(e.target.value)} />
                                        </div>

                                        <div className="my-6">
                                            <label htmlFor="victimContact">Victim's Contact (Optional)</label>
                                            <br />
                                            <input type="text" id="victimContact" placeholder="Phone or email" value={victimContact} onChange={(e)=>setVictimContact(e.target.value)}/>
                                        </div>

                                    </div>
                                </div>
                                :
                                <div>
                                    <p>You are continuing as a victim</p>
                                </div>
                            }

                            <p>Accused / Suspect Details (Optional)</p>
                            <p className="font-light">Provide any known information about the perpetrator.</p>
                            <div className="flex">
                                <div>
                                    <label htmlFor="accusedName">Name</label>
                                    <br />
                                    <input type="text" id="accusedName" placeholder="Name if known" value={accusedName} onChange={(e) => setAccusedName(e.target.value)} />
                                </div>

                                <div>
                                    <label htmlFor="relationshipToVictim">Relationship to Victim</label>
                                    <br />
                                    <input type="text" id="relationshipToVictim" placeholder="e.g., Colleague, Stranger, spouse"
                                        value={relationshipToVictim} onChange={(e) => setRelationShipToVictim(e.target.value)} />
                                </div>

                            </div>
                            <label htmlFor="physicalDescription">Physical Description</label>
                            <br />
                            <input type="text" id="physicalDescription" placeholder="Physical Description"
                                value={victimPhysicalDescription} onChange={(e) => setVictimPhysicalDescription(e.target.value)} />
                            <br />
                            <label htmlFor="address">Known Location / Address</label>
                            <br />
                            <input type="text" id="address" placeholder="Known Location / Address"
                                value={victimLocation} onChange={(e) => setVictimLocation(e.target.value)} />

                        </div>
                        {handelBackNext()}
                    </div>
                );

            case 4:
                return (
                    <div className="m-20 bg-amber-500 p-5">

                        <p>Detailed Description *</p>
                        <label htmlFor="description" className="opacity-50">Describe what happened in as much detail as possible.</label>
                        <br />
                        <textarea className="w-full h-36 bg-amber-50" id="description" placeholder="Please provide a detailed account of the incident" value={detailedComplaint} onChange={(e) => setDetailedComplaint(e.target.value)}></textarea>
                        <br />
                        <label htmlFor="file">Evidence Upload (Optional)</label>
                        <br />
                        <label htmlFor="file" className="opacity-50" >Attach photos, videos, screenshots, or documents. Max 10MB per file.</label>
                        <input type="file" id="file" className="w-full h-36 bg-amber-50" multiple placeholder="Upload file or drag and drop" onChange={handelFileUpload} />
                        {handelBackNext()}
                    </div>
                );


            case 5:
                return (
                    <div className="m-20 bg-amber-500 p-5">
                        <div>
                            <p>Priority & Action Flags</p>
                            <div className="flex">
                                <input type="checkbox" className="h-6 w-6 mt-2" id="check1" checked={urgentChB} onChange={()=>setUrgentChB(!urgentChB)}/>
                                <div>
                                    <label htmlFor="check1">Mark as Urgent</label> <br />
                                    <label htmlFor="check1" className="opacity-50">Flag this complaint for faster review by authorities.</label>
                                </div>
                            </div>

                            <div className="flex">
                                <input type="checkbox" className="h-6 w-6 mt-2" id="check2" checked={sosChB} onChange={()=>setSosChB(!sosChB)} />
                                <div>
                                    <label htmlFor="check2" className="text-red-800">Request Immediate Help (SOS)</label> <br />
                                    <label htmlFor="check2" className=" text-red-600 font-light">Check this if you are in immediate danger.</label>
                                </div>
                            </div>

                            <div className="flex">
                                <input type="checkbox" className="h-6 w-6 mt-2" id="check3" checked={authorityContact} onChange={()=>setAuthorityContact(!authorityContact)} />
                                <div>
                                    <label htmlFor="check3" >Allow Authority Contact</label> <br />
                                    <label htmlFor="check" className="opacity-50" >Permit investigating officers to contact you via phone or email.</label>
                                </div>
                            </div>

                        </div>
                        {handelBackNext()}
                    </div>
                )
                case 6:
                    return(
                        <div className="m-20 bg-amber-500 p-5">
                            <p>form submitted successfully</p>
                            <button type="button" onClick={()=>navigate("/user/dashboard")}>Go to Dashboard</button>
                        </div>
                    )
            default:
                return <p>unknown step</p>

        }

    }
    return (
        <div className="mainContainer">

            <div className="header">
                <h2>File a Formal Complaint</h2>
            </div>

            <div>
                <p>logo_placeholder</p>
            </div>

            {collectComplaintDetails()}



        </div>
    );
}