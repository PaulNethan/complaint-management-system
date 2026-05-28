import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterComplaintsPage() {


  const canProceed = () => {
    switch (step) {
      case 1:
        return complaintDetails.complaint_type !== "" && complaintDetails.severity_level !== ""
      case 2:
        return complaintDetails.incident_date !== "" && complaintDetails.incident_location !== ""
      case 3:
        return true
      case 4:
        return complaintDetails.detailed_description.trim() !== ""
      case 5:
        return complaintDetails.valid_details_consent === true &&
          complaintDetails.privacy_policy_consent === true
      default:
        return true;
    }
  }
  const token = localStorage.getItem("token");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const [complaintDetails, setComplaints] = useState({
    complaint_type: "",
    severity_level: "",
    urgent: false,
    sos: false,
    request_authority_reach_out: false,
    incident_date: "",
    incident_time: "",
    on_going: false,
    incident_location: "",
    victim: false,
    victim_name: "",
    victim_email: "",
    victim_phone_no: "",
    accused_name: "",
    relationship_to_victim: "",
    accused_physical_description: "",
    accused_location: "",
    detailed_description: "",
    valid_details_consent: false,
    privacy_policy_consent: false,
    victim_contact_info: ""
  })
  const [evidence, setEvidence] = useState([]);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const nextStep = () => (canProceed() ? setStep(step + 1) : alert("Please fill in the required fields."))
  const prevStep = () => setStep(step - 1);

  const handelChange = (event) => {
    const { name, value, type, checked } = event.target;
    setComplaints((oldData) => ({
      ...oldData,
      [name]: type === "checkbox" ? checked : value
    }))
  }


  const handelSubmitComplaints = async () => {
    const formData = new FormData();

    const contact_input = complaintDetails.victim_contact_info
    if (contact_input !== "") {
      let emailValue = ""
      let phoneValue = ""

      if (emailRegex.test(contact_input)) {
        emailValue = contact_input
      } else if (phoneRegex.test(contact_input)) {
        phoneValue = contact_input
      } else {
        alert("Please enter a valid email address or 10-digit phone number.")
        return;
      }
      formData.append("victim_email", emailValue);
      formData.append("victim_phone_no", phoneValue);
    }

    Object.keys(complaintDetails).forEach((key) => {
      if (key !== "victim_contact_info" && key !== "victim_email" && key !== "victim_phone_no") {
        formData.append(key, complaintDetails[key]);
      }
    })
    evidence.forEach((file) => {
      formData.append("evidence_file", file);
    });



    const response = await fetch(
      "http://127.0.0.1:8000/api/user/raisecomplaints/",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    const data = await response.json()
    console.log(data)

    nextStep();
  };

  const handelFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidence(Array.from(e.target.files));
    }
  };
  const handelBackNext = () => {
    return (
      <div className="flex justify-between">
        {step > 1 && (
          <button type="button" className="mx-24 my-8" onClick={prevStep}>
            Back
          </button>
        )}
        {step === 5 ? (
          <button
            type="submit"
            className="mx-24 my-8"
            onClick={handelSubmitComplaints}
          >
            Submit formal Complaint
          </button>
        ) : (
          <button type="button" className="mx-24 my-8" onClick={nextStep}>
            Next Step{" "}
          </button>
        )}
      </div>
    );
  };
  const collectComplaintDetails = () => {
    switch (step) {
      case 1:
        return (
          <div className="m-20 bg-amber-500 p-5">
            <p>Complaint Classification</p>

            <div className="flex">
              <div>
                <label htmlFor="compType">Complaint Type*</label>
                <br />
                <select
                  id="compType"
                  value={complaintDetails.complaint_type}
                  onChange={handelChange}
                  name="complaint_type"
                >
                  <option value="">Select Complaint Type</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Cyber">cyber Security</option>
                  <option value="Domestic violence">Domestic violence</option>
                  <option value="Stalking">Stalking</option>
                  <option value="assault">Assault</option>
                  <option value="workspaceHarassment">
                    workspace Harassment
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="severity">Severity Level*</label>
                <br />
                <select
                  id="severity"
                  value={complaintDetails.severity_level}
                  onChange={handelChange}
                  name="severity_level"
                >
                  <option value="">Select Severity Level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">high</option>
                </select>
              </div>
            </div>

            {handelBackNext()}
          </div>
        );

      case 2:
        return (
          <div className="m-20 bg-amber-500 p-5">
            <p>Incident Details</p>

            <div>
              <label htmlFor="date">Date of incident*</label> <br />
              <input
                id="date"
                type="date"
                value={complaintDetails.incident_date}
                onChange={handelChange}
                name="incident_date"
              />
              <br />
              <label htmlFor="time">Time of incident</label> <br />
              <input
                id="time"
                type="time"
                value={complaintDetails.incident_time}
                name="incident_time"
                onChange={handelChange}
              />
              <br />
              <label htmlFor="location">Location of incident*</label>
              <br />
              <input
                id="location"
                type="text"
                placeholder=" Enter location"
                value={complaintDetails.incident_location}
                name="incident_location"
                onChange={handelChange}
              />
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={complaintDetails.on_going}
                  onChange={handelChange}
                  name="on_going"
                />
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
              <input
                type="checkbox"
                id="victimCheck"
                checked={complaintDetails.victim}
                name="victim"
                onChange={handelChange}
              />
              <label htmlFor="victimCheck">
                I am the victim in this incident
              </label>
              {complaintDetails.victim === false ? (
                <div>
                  <div className=" flex gap-9">
                    <div className="my-6">
                      <label htmlFor="victimName">
                        Victim's Name (Optional)
                      </label>
                      <br />
                      <input
                        type="text"
                        id="victimName"
                        placeholder="Leave blank if unknown or anonymous"
                        value={complaintDetails.victim_name}
                        name="victim_name"
                        onChange={handelChange}
                      />
                    </div>

                    <div className="my-6">
                      <label htmlFor="victimContact">
                        Victim's Contact (Optional)
                      </label>
                      <br />
                      <input
                        type="text"
                        id="victimContact"
                        placeholder="Phone or email"
                        value={complaintDetails.victim_contact_info}
                        name="victim_contact_info"
                        onChange={handelChange}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p>You are continuing as a victim</p>
                </div>
              )}

              <p>Accused / Suspect Details (Optional)</p>
              <p className="font-light">
                Provide any known information about the perpetrator.
              </p>
              <div className="flex">
                <div>
                  <label htmlFor="accusedName">Name</label>
                  <br />
                  <input
                    type="text"
                    id="accusedName"
                    placeholder="Name if known"
                    value={complaintDetails.accused_name}
                    name="accused_name"
                    onChange={handelChange}
                  />
                </div>

                <div>
                  <label htmlFor="relationshipToVictim">
                    Relationship to Victim
                  </label>
                  <br />
                  <input
                    type="text"
                    id="relationshipToVictim"
                    placeholder="e.g., Colleague, Stranger, spouse"
                    value={complaintDetails.relationship_to_victim}
                    name="relationship_to_victim"
                    onChange={handelChange}
                  />
                </div>
              </div>
              <label htmlFor="physicalDescription">Physical Description</label>
              <br />
              <input
                type="text"
                id="physicalDescription"
                placeholder="Physical Description"
                value={complaintDetails.accused_physical_description}
                name="accused_physical_description"
                onChange={handelChange}
              />
              <br />
              <label htmlFor="address">Known Location / Address</label>
              <br />
              <input
                type="text"
                id="address"
                placeholder="Known Location / Address"
                value={complaintDetails.accused_location}
                name="accused_location"
                onChange={handelChange}
              />
            </div>
            {handelBackNext()}
          </div>
        );

      case 4:
        return (
          <div className="m-20 bg-amber-500 p-5">
            <p>Detailed Description *</p>
            <label htmlFor="detailed_description" className="opacity-50">
              Describe what happened in as much detail as possible.
            </label>
            <br />
            <textarea
              className="w-full h-36 bg-amber-50"
              id="detailed_description"
              placeholder="Please provide a detailed account of the incident"
              value={complaintDetails.detailed_description}
              name="detailed_description"
              onChange={handelChange}
            ></textarea>
            <br />
            <label htmlFor="file">Evidence Upload (Optional)</label>
            <br />
            <label htmlFor="file" className="opacity-50">
              Attach photos, videos, screenshots, or documents. Max 10MB per
              file.
            </label>
            <input
              type="file"
              id="file"
              className="w-full h-36 bg-amber-50"
              multiple
              placeholder="Upload file or drag and drop"
              onChange={handelFileUpload}
            />
            {handelBackNext()}
          </div>
        );

      case 5:
        return (
          <div className="m-20 bg-amber-500 p-5">
            <div className="mb-5">
              <p>Priority & Action Flags</p>
              <div className="flex">
                <input
                  type="checkbox"
                  className="h-6 w-6 mt-2"
                  id="check1"
                  checked={complaintDetails.urgent}
                  onChange={handelChange}
                  name="urgent"
                />
                <div>
                  <label htmlFor="check1">Mark as Urgent</label> <br />
                  <label htmlFor="check1" className="opacity-50">
                    Flag this complaint for faster review by authorities.
                  </label>
                </div>
              </div>

              <div className="flex">
                <input
                  type="checkbox"
                  className="h-6 w-6 mt-2"
                  id="check2"
                  checked={complaintDetails.sos}
                  onChange={handelChange}
                  name="sos"
                />
                <div>
                  <label htmlFor="check2" className="text-red-800">
                    Request Immediate Help (SOS)
                  </label>
                  <br />
                  <label htmlFor="check2" className=" text-red-600 font-light">
                    Check this if you are in immediate danger.
                  </label>
                </div>
              </div>

              <div className="flex">
                <input
                  type="checkbox"
                  className="h-6 w-6 mt-2"
                  id="check3"
                  checked={complaintDetails.request_authority_reach_out}
                  onChange={handelChange}
                  name="request_authority_reach_out"
                />
                <div>
                  <label htmlFor="check3">Allow Authority Contact</label> <br />
                  <label htmlFor="check" className="opacity-50">
                    Permit investigating officers to contact you via phone or
                    email.
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p>Declaration & Consent</p>
              <div className="flex">
                <input type="checkbox" id="consent1" className="h-6 w-6 mt-2" checked={complaintDetails.valid_details_consent} onChange={handelChange} name="valid_details_consent" />
                <div>
                  <label htmlFor="consent1">I confirm that the information provided is true to the best of my knowledge. *</label>
                  <br />
                  <label htmlFor="consent1" className="opacity-50">{complaintDetails.valid_details_consent ? "" : "You must confirm this declaration"}</label>
                </div>
              </div>
              <div className="flex">
                <input type="checkbox" id="consent2" className="h-6 w-6 mt-2" checked={complaintDetails.privacy_policy_consent} onChange={handelChange} name="privacy_policy_consent" />
                <div>
                  <label htmlFor="consent2">I agree to the privacy policy and understand how my data will be handled. *</label>
                  <br />
                  <label htmlFor="consent2" className="opacity-50">{complaintDetails.privacy_policy_consent ? "" : "You must agree to the privacy policy"}</label>
                </div>
              </div>
            </div>
            {handelBackNext()}
          </div>
        );
      case 6:
        return (
          <div className="m-20 bg-amber-500 p-5">
            <p>form submitted successfully</p>
            <button type="button" onClick={() => navigate("/user/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        );
      default:
        return <p>unknown step</p>;
    }
  };


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
