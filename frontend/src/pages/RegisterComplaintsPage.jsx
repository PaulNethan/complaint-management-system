import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterComplaintsPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [complaintType, setComplaintType] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [urgentChB, setUrgentChB] = useState(false);
  const [sosChB, setSosChB] = useState(false);
  const [authorityContact, setAuthorityContact] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [onGoingCheckBox, setOnGoingCheckBox] = useState(false);
  const [location, setLocation] = useState("");
  const [victimCheckBox, setVictimCheckBox] = useState(false);
  const [victimName, SetVictimName] = useState("");
  const [victimEmail, setVictimEmail] = useState("");
  const [victimContact, setVictimContact] = useState("");
  const [accusedName, setAccusedName] = useState("");
  const [relationshipToVictim, setRelationShipToVictim] = useState("");
  const [victimPhysicalDescription, setVictimPhysicalDescription] = useState("");
  const [victimLocation, setVictimLocation] = useState("");
  const [detailedComplaint, setDetailedComplaint] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [valid_details_consent, setValid_details_consent] = useState(false);
  const [privacy_policy_consent, setPrivacy_policy_consent] = useState(false);

  const handelSubmitComplaints = async () => {
    const formData = new FormData();

    formData.append("complaint_type", complaintType);
    formData.append("severity_level", severityLevel);
    formData.append("urgent", urgentChB);
    formData.append("sos", sosChB);
    formData.append("request_authority_reach_out", authorityContact);
    formData.append("incident_date", date);
    formData.append("incident_time", time);
    formData.append("on_going", onGoingCheckBox);
    formData.append("incident_location", location);
    formData.append("victim", victimCheckBox);
    formData.append("victim_name", victimName);
    formData.append("victim_email", victimEmail);
    formData.append("victim_phone_no", victimContact);
    formData.append("accused_name", accusedName);
    formData.append("relationship_to_victim", relationshipToVictim);
    formData.append("accused_physical_description", victimPhysicalDescription);
    formData.append("accused_location", victimLocation);
    formData.append("detailed_description", detailedComplaint);
    formData.append("valid_details_consent", valid_details_consent);
    formData.append("privacy_policy_consent", privacy_policy_consent);

    evidence.forEach((file) => {
      formData.append("evidence_file", file);
    });

    const token = localStorage.getItem("token");

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
                <label htmlFor="compType">Complaint Type</label>
                <br />
                <select
                  id="compType"
                  defaultValue=""
                  onChange={(e) => setComplaintType(e.target.value)}
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
                <label htmlFor="severity">Severity Level </label>
                <br />
                <select
                  id="severity"
                  defaultValue=""
                  onChange={(e) => setSeverityLevel(e.target.value)}
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
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <br />
              <input
                type="text"
                placeholder=" Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={onGoingCheckBox}
                  onChange={() => setOnGoingCheckBox(!onGoingCheckBox)}
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
                checked={victimCheckBox}
                onChange={() => setVictimCheckBox(!victimCheckBox)}
              />
              <label htmlFor="victimCheck">
                I am the victim in this incident
              </label>
              {victimCheckBox === false ? (
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
                        value={victimName}
                        onChange={(e) => SetVictimName(e.target.value)}
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
                        value={victimContact}
                        onChange={(e) => setVictimContact(e.target.value)}
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
                    value={accusedName}
                    onChange={(e) => setAccusedName(e.target.value)}
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
                    value={relationshipToVictim}
                    onChange={(e) => setRelationShipToVictim(e.target.value)}
                  />
                </div>
              </div>
              <label htmlFor="physicalDescription">Physical Description</label>
              <br />
              <input
                type="text"
                id="physicalDescription"
                placeholder="Physical Description"
                value={victimPhysicalDescription}
                onChange={(e) => setVictimPhysicalDescription(e.target.value)}
              />
              <br />
              <label htmlFor="address">Known Location / Address</label>
              <br />
              <input
                type="text"
                id="address"
                placeholder="Known Location / Address"
                value={victimLocation}
                onChange={(e) => setVictimLocation(e.target.value)}
              />
            </div>
            {handelBackNext()}
          </div>
        );

      case 4:
        return (
          <div className="m-20 bg-amber-500 p-5">
            <p>Detailed Description *</p>
            <label htmlFor="description" className="opacity-50">
              Describe what happened in as much detail as possible.
            </label>
            <br />
            <textarea
              className="w-full h-36 bg-amber-50"
              id="description"
              placeholder="Please provide a detailed account of the incident"
              value={detailedComplaint}
              onChange={(e) => setDetailedComplaint(e.target.value)}
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
                  checked={urgentChB}
                  onChange={() => setUrgentChB(!urgentChB)}
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
                  checked={sosChB}
                  onChange={() => setSosChB(!sosChB)}
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
                  checked={authorityContact}
                  onChange={() => setAuthorityContact(!authorityContact)}
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
                    <input type="checkbox" id="consent1" className="h-6 w-6 mt-2" checked={valid_details_consent} onChange={()=>setValid_details_consent(!valid_details_consent)}/>
                    <div>
                        <label htmlFor="consent1">I confirm that the information provided is true to the best of my knowledge. *</label>
                        <br />
                        <label htmlFor="consent1" className="opacity-50">{valid_details_consent ? "" : "You must confirm this declaration"}</label>
                    </div>
                </div>
                <div className="flex">
                    <input type="checkbox" id="consent2" className="h-6 w-6 mt-2" checked={privacy_policy_consent} onChange={()=>setPrivacy_policy_consent(!privacy_policy_consent)}/>
                    <div>
                        <label htmlFor="consent2">I agree to the privacy policy and understand how my data will be handled. *</label>
                        <br />
                        <label htmlFor="consent2" className="opacity-50">{privacy_policy_consent ? "" : "You must agree to the privacy policy"}</label>
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
