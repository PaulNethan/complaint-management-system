export default function ReviewConsentStep({ details, onChange }) {
    return (
        <div className="  bg-[#FFFFFF] flex flex-col space-y-5 p-5">


            <div className="flex flex-col space-y-3 p-4 rounded-xl border border-[#F9FAFB} bg-[#F9FAFB] ">
                <p className="text-xl font-medium border-b border-[#E5E5E5] ">Priority & Action Flags</p>
                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        className="h-5 w-5 "
                        id="check1"
                        checked={details.urgent}
                        onChange={onChange}
                        name="urgent"
                    />
                    <div>
                        <label htmlFor="check1">Mark as Urgent</label> <br />
                        <label htmlFor="check1" className="opacity-50">
                            Flag this complaint for faster review by authorities.
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        className="h-5 w-5"
                        id="check2"
                        checked={details.sos}
                        onChange={onChange}
                        name="sos"
                    />
                    <div>
                        <label htmlFor="check2" className="text-red-800 font-medium">
                            Request Immediate Help (SOS)
                        </label>
                        <br />
                        <label htmlFor="check2" className=" text-red-600 font-light">
                            Check this if you are in immediate danger.
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        className="h-5 w-5 "
                        id="check3"
                        checked={details.request_authority_reach_out}
                        onChange={onChange}
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


            <div className="border-t border-[#E5E5E5] pt-5 flex flex-col space-y-3">
                <p className="font-medium text-xl">Declaration & Consent</p>
                <div className="">


                    <div className="flex gap-2">
                        <div className="flex flex-row items-start ">
                            <input type="checkbox" id="consent1" className="h-5 w-5 " checked={details.valid_details_consent} onChange={onChange} name="valid_details_consent" />
                        </div>
                        <div>
                            <label htmlFor="consent1" className="font-medium">I confirm that the information provided is true to the best of my knowledge. *</label>
                            <p className=" text-[#FB2C36] text-xs font-medium py-3">{details.valid_details_consent ? "" : "You must confirm this declaration"}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex flex-row items-start ">
                            <input type="checkbox" id="consent2" className="h-5 w-5 " checked={details.privacy_policy_consent} onChange={onChange} name="privacy_policy_consent" />
                        </div>
                        <div>
                            <label htmlFor="consent2" className="font-medium">I agree to the privacy policy and understand how my data will be handled. *</label>
                            <p className=" text-[#FB2C36] text-xs font-medium py-3">{details.privacy_policy_consent ? "" : "You must agree to the privacy policy"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}