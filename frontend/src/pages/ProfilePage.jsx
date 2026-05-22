import { useEffect, useState } from "react"

export default function HomePage() {

  const token = localStorage.getItem("token")
  const [profilePictureUrl, setProfilePictureUrl] = useState("")

  const HandelProfile = async (e) =>{
    const selectedFile = e.target.files[0];

    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("file is too big");
      return;
    }
    const formdata = new FormData();
    formdata.append("profile_picture", selectedFile);

    const response = await fetch("http://127.0.0.1:8000/api/profilepic/",{
      method: "POST",
      headers:{Authorization: `bearer ${token}`},
      body: formdata
    });

    const data = await response.json();

    if(response.ok){
      setProfilePictureUrl(data.message)
    }else{
      alert(data.message);
    }

  }
    useEffect(() => {
    const fetchProfilePic = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/profilepic/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.message !== "") {
        setProfilePictureUrl(data.message);
      }
    };
    
    fetchProfilePic();
  }, []);

  return (
    <div>

        <p className="font-extrabold" id="header">profile_picture</p>
        <label htmlFor="header" className="opacity-50">Manage your personal information</label>

        <div>
          <p className="font-bold ">Profile Picture</p>
          <div className="flex">
          <img src={`http://127.0.0.1:8000${profilePictureUrl}`} alt="My profile" className="w-32 h-32 rounded-full object-cover" />
          </div>

          <div>
            <p id="upload">Upload a new photo</p>
            <label htmlFor="upload" className="opacity-50">JPG, GIF or PNG. Max size of 2MB.</label>
            <input type="file" placeholder="Choose file" accept=".jpg, .jpeg, .png, .gif"
            onChange={HandelProfile}
            />
          </div>
        </div>
    </div>
  )
}

