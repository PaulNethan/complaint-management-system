import { Card } from "../ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ClassificationStep({ details, onChange }) {

    return (
        <div className="  bg-[#FFFFFF] flex flex-col space-y-5 p-5">
            <p className="text-xl font-medium border-b ">Complaint Classification</p>

            <div className="flex flex-row gap-5 justify-around">

                <div className="flex flex-col  flex-1">
                    <label htmlFor="compType" className="font-medium text-md" >Complaint Type*</label>
                    <Select value={details.complaint_type} onValueChange={(selectedValue) =>
                        onChange({ target: { name: "complaint_type", value: selectedValue } })
                    }>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Complaint Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Harassment">Harassment</SelectItem>
                            <SelectItem value="cyber_crime">cyber Security</SelectItem>
                            <SelectItem value="Domestic violence">Domestic violence</SelectItem>
                            <SelectItem value="Stalking">Stalking</SelectItem>
                            <SelectItem value="assault">Assault</SelectItem>
                            <SelectItem value="workspaceHarassment">
                                workspace Harassment
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col flex-1">
                    <label htmlFor="severity" className="font-medium text-md">Severity Level*</label>

                    <Select value={details.severity_level} onValueChange={(selectedValue) =>
                        onChange({ target: { name: "severity_level", value: selectedValue } })
                    }>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Severity Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">high</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>


        </div>
    )
}