import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function DescriptionStep({ details, onChange, evidence, onFileUpload }) {
    return (
        <div className="  bg-[#FFFFFF] flex flex-col space-y-5 p-5">
            <p className="text-xl font-medium border-b border-[#E5E5E5] " >Detailed Description *</p>

            <label htmlFor="detailed_description" className="opacity-50">
                Describe what happened in as much detail as possible.
            </label>

            <Textarea
                className="w-full h-36"
                id="detailed_description"
                placeholder="Please provide a detailed account of the incident"
                value={details.detailed_description}
                name="detailed_description"
                onChange={onChange}
            ></Textarea>

            <label htmlFor="file">Evidence Upload (Optional)</label>

            <label htmlFor="file" className="opacity-50">
                Attach photos, videos, screenshots, or documents. Max 10MB per
                file.
            </label>
            <Input
                type="file"
                id="file"
                className="w-full h-36 "
                multiple
                onChange={onFileUpload}
            />
            {evidence.length > 0 && (
                <div className="mt-5">
                    <p>Evidence</p>
                    {evidence.map((current) => (
                        <div key={current.name} className="flex gap-1 items-center">
                            {current.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}