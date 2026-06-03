import { Input } from "../ui/input";

export default function AccusedDetailsStep({ details, onChange }) {
    return (
        <div className="  bg-[#FFFFFF] flex flex-col space-y-5 p-5">
            <p className="text-xl font-medium border-b ">Victim Information</p>
            <div>

                <div className="flex flex-row items-center gap-3 mb-4">
                    <Input
                        type="checkbox"
                        id="victimCheck"
                        checked={details.victim}
                        name="victim"
                        onChange={onChange}
                        className="h-5 w-5 "
                    />
                    <label htmlFor="victimCheck" className="opacity-85">
                        I am the victim in this incident
                    </label>
                </div>


                {details.victim === false ? (
                    <div className="flex flex-row justify-between p-3 space-x-5 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] mb-12">

                        <div className="flex flex-col flex-1">

                            <label htmlFor="victimName" className="font-medium">
                                Victim's Name (Optional)
                            </label>
                            <Input
                                type="text"
                                id="victimName"
                                placeholder="Leave blank if unknown or anonymous"
                                value={details.victim_name}
                                name="victim_name"
                                onChange={onChange}

                            />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label htmlFor="victimContact" className="font-medium">
                                Victim's Contact (Optional)
                            </label>

                            <Input
                                type="text"
                                id="victimContact"
                                placeholder="Phone or email"
                                value={details.victim_contact_info}
                                name="victim_contact_info"
                                onChange={onChange}
                            />
                        </div>
                    </div>
                ) : null}

                <p className="text-lg font-medium border-b pb-2">Accused / Suspect Details (Optional)</p>
                <p className="text-sm  font-normal py-4 text-[#6a7282]">
                    Provide any known information about the perpetrator.
                </p>


                <div className="flex space-x-5 space-y-5">
                    <div className="flex-1">
                        <label htmlFor="accusedName" className="font-medium">Name</label>
                        <Input
                            type="text"
                            id="accusedName"
                            placeholder="Name if known"
                            value={details.accused_name}
                            name="accused_name"
                            onChange={onChange}
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="relationshipToVictim" className="font-medium">
                            Relationship to Victim
                        </label>
                        <Input
                            type="text"
                            id="relationshipToVictim"
                            placeholder="e.g., Colleague, Stranger, spouse"
                            value={details.relationship_to_victim}
                            name="relationship_to_victim"
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="physicalDescription">Physical Description</label>

                    <Input
                        type="text"
                        id="physicalDescription"
                        placeholder="Physical Description"
                        value={details.accused_physical_description}
                        name="accused_physical_description"
                        onChange={onChange}
                    />

                    <label htmlFor="address">Known Location / Address</label>

                    <Input
                        type="text"
                        id="address"
                        placeholder="Known Location / Address"
                        value={details.accused_location}
                        name="accused_location"
                        onChange={onChange}
                    />
                </div>
            </div>
        </div>
    )
}