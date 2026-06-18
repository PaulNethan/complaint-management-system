import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ClassificationStep from "@/components/Register-components/ClassificationStep";
import IncidentDetailsStep from "@/components/Register-components/IncidentDetailsStep";
import AccusedDetailsStep from "@/components/Register-components/AccusedDetailsStep";
import DescriptionStep from "@/components/Register-components/DescriptionStep";
import ReviewConsentStep from "@/components/Register-components/ReviewConsentStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { apiFetch } from "@/services/api";


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



    const response = await apiFetch("/api/user/raisecomplaints/",
      {
        method: "POST",
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
        {step === 1 && (
          <div className=" flex justify-between w-full mx-2">
            <Button asChild variant="outline" type="button" className="p-5"  >
              <Link to="/user/dashboard">
                Cancel
              </Link>

            </Button>
            <Button onClick={nextStep} className="p-5">
              Next
            </Button>
          </div>

        )}
        {step === 5 ? (
          <div className="flex justify-between w-full mx-2">
            <Button variant="outline" type="button" className="p-5" onClick={prevStep}>
              Back
            </Button>
            <Button
              type="submit"
              className="p-5"
              onClick={handelSubmitComplaints}
            >
              Submit formal Complaint
            </Button>
          </div>
        ) : (
          step > 1 && step !== 6 && (
            <div className="flex justify-between w-full mx-2">
              <Button variant="outline" type="button" className="p-5" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} className="p-5">
                Next
              </Button>
            </div>)

        )}

      </div>
    );
  };





  return (
    <div className="min-h-screen p-8 flex flex-col  bg-[#F7F8FC]">
      <div className="w-full max-w-3xl mx-auto space-y-8">


        <div className="header">
          <h1 id="head" className="text-2xl font-bold">File a Formal Complaint</h1>
          <label htmlFor="head" className="opacity-70">Please provide as much detail as possible. Your information is secure and confidential.</label>
        </div>

        <div>

        </div>

        <Card className=" min-w-sm flex flex-col justify-between">


          {/* The Step Components (Conditionals) */}
          {step === 1 && <ClassificationStep details={complaintDetails} onChange={handelChange} />}
          {step === 2 && <IncidentDetailsStep details={complaintDetails} onChange={handelChange} />}
          {step === 3 && <AccusedDetailsStep details={complaintDetails} onChange={handelChange} />}
          {step === 4 && <DescriptionStep details={complaintDetails} onChange={handelChange} evidence={evidence} onFileUpload={handelFileUpload} />}
          {step === 5 && <ReviewConsentStep details={complaintDetails} onChange={handelChange} />}
          {step === 6 && (
            <div className="min-h-[300px] ">
              <div className=" flex flex-col w-full mx-2 space-y-5">
                <div className=" flex-1 flex flex-col space-y-5 justify-center items-center">


                  <div className="h-32 w-32 rounded-full bg-green-200 flex items-center text-green-500 justify-center">
                    <CircleCheck size={100} />
                  </div>
                  <p className="text-xl font-bold">Thank you! Your Complaint Has Been Submitted Successfully</p>
                  <Button onClick={() => navigate("/user/dashboard")}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="">
            {handelBackNext()}
          </div >

        </Card>
      </div>
    </div>
  );
}
