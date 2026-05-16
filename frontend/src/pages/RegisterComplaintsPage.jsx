import { useState } from "react";

export default function RegisterComplaintsPage(){

    const [step , setStep] = useState(1)
    const nextStep = () => setStep(step+1)
    const prevStep = () => setStep(step-1)

    const collectComplaintDetails = () =>{
        switch (step) {
                    case 1:
                        return(
                        <div>

                            <p>Incident details</p>

                            <select defaultValue="">
                                <option value="">Select Complaint Type</option>
                                <option value="Harassment">Harassment</option>
                                <option value="Cyber">cyber Security</option>
                                <option value="Domestic violence">Domestic violence</option>
                                <option value="Stalking">Stalking</option>
                                <option value="assault">Assault</option>
                                <option value="workspaceHarassment">workspace Harassment</option>


                                
                            </select>

                            <select defaultValue="">
                                <option value="">Select Severity Level</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">high</option>
                            </select>

                        </div>
                        );


                    case 2:
                        return(
                            <div>

                            </div>
                        );
                        
                
                    default:
                        return <p>unknown step</p>

                }

    }
    return(
        <div className="mainContainer">

            <div className="header">
                <h2>File a Formal Complaint</h2>
            </div>

            <div>
                <p>logo_placeholder</p>
            </div>

            {collectComplaintDetails()}

            <div>
                {
                step > 1 && (
                    <button type="button" onClick={prevStep}>Back</button>
                )
            }
                <button type="button" onClick={nextStep}>Next Step</button>
            </div>

        </div>
    );
}