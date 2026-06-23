import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/services/api";


export default function HomePage() {

  const [profilePictureUrl, setProfilePictureUrl] = useState("")

  const HandelProfile = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("file is too big");
      return;
    }
    const formdata = new FormData();
    formdata.append("profile_picture", selectedFile);

    const response = await apiFetch("/api/profilepic/", {
      method: "POST",
      body: formdata
    });

    const data = await response.json();

    if (response.ok) {
      setProfilePictureUrl(data.message)
    } else {
      alert(data.message);
    }

  }
  useEffect(() => {
    const fetchProfilePic = async () => {
      const response = await apiFetch("/api/profilepic/", {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok && data.message !== "") {
        setProfilePictureUrl(data.message);
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <div className="min-h-dvh w-full flex p-9" >
      <div className=" mx-auto space-y-5 max-w-full min-w-3xl">

        <div>



          <p className="font-extrabold text-2xl" id="header">Profile Picture</p>
          <label htmlFor="header" className="opacity-80 ">Manage your personal information</label>
        </div>


        <Card className="bg-[#FFFFFF]  p-9 flex flex-col gap-3">

          <p className="font-bold  text-xl ">Profile Picture</p>
          <div className="flex gap-7">

            <div className="flex">
              <img src={`${profilePictureUrl}`} alt="My profile" className="w-24 h-24 rounded-full border-2 object-cover" />
            </div>


            <div>
              <p id="upload">Upload a new photo</p>
              <label htmlFor="upload" className="opacity-70 text-xs">JPG, GIF or PNG. Max size of 2MB.</label>
              <div className="flex gap-3">



                <div className="flex">


                  <Input type="file" placeholder="Choose file" accept=".jpg, .jpeg, .png, .gif"
                    onChange={HandelProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div >
  )
}

