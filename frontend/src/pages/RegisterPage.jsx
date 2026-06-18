import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Shield, User, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from "@/services/api";


export default function RegisterPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [auth_type, setAuth_type] = useState("")
  const [name, setName] = useState("")

  const registerBackend = async () => {

    const response = await apiFetch("/api/register/", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: email,
        password: password,
        role: role,
        authority_type: auth_type,
        name: name
      })
    }
    )
    const data = await response.json()
    console.log(data)

  }

  const handleAuthentication = async (e) => {

    e.preventDefault();


    console.log("email:", email)
    console.log("password:", password)
    console.log("role", role)

    await registerBackend()

    setEmail("")
    setPassword("")
    setName("")
  }


  return (
    <div className='min-h-screen p-8 flex flex-col justify-center items-center bg-[#F7F8FC]'>

      <Card className=" min-w-sm p-7 bg-[#FFFFFF]" >


        <div className='flex flex-col items-center gap-5'>
          <div className='bg-[#4F39F6] flex items-center justify-center w-fit rounded-xl text-white p-1.5'>
            <Shield size={32} />
          </div>

          <div>
            <div className='flex gap-2 justify-center'>


              <h1 id="head" className='font-bold text-3xl '>Create</h1>
              <span className='text-[#4F39F6] font-bold text-3xl '>Account</span>
            </div>
            <label htmlFor="head" className='text-center opacity-90 font-light '>Join SafeSpace to report and track securely</label>
          </div>
        </div>


        <div className='flex flex-col'>


          <form onSubmit={handleAuthentication}>
            <div className='flex flex-row justify-center gap-3.5'>


              <Button
                type='button'
                onClick={() => setRole("user")}
                className="flex-1"
              >
                Citizen
              </Button>

              <Button
                type='button'
                onClick={() => setRole("authority")}
                className="flex-1"
                variant="secondary"
              >
                Authority
              </Button>
            </div>

            {role === "authority" && (
              <div className='flex flex-row gap-2.5 p-2'>
                <Button type='button' className="flex-1" onClick={() => setAuth_type("police")}>Police</Button><br />
                <Button type='button' className="flex-1" onClick={() => setAuth_type("cyber_crime")}>Cyber crime</Button>
              </div>
            )}


            <div className="py-5 flex flex-col space-y-3.5">

              <div className='relative'>
                <User className='opacity-50 absolute left-3 top-1/2 h-4 w-4  -translate-y-1/2 ' />
                <Input type="text"
                  value={name}
                  placeholder='Full Name'
                  onChange={(event) => setName(event.target.value)}
                  className="pl-10"
                />
              </div>

              <div className='relative '>

                <Mail className='opacity-50 absolute left-3 top-1/2 h-4 w-4  -translate-y-1/2' />
                <Input type="email"
                  value={email}
                  placeholder='Enter email'
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-10"
                />
              </div>
              <div className='relative'>
                <Lock className=' h-4 w-4 absolute opacity-50 left-3  top-1/2  -translate-y-1/2' />
                <Input
                  type='password'
                  value={password}
                  placeholder='Enter Password'
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-10"
                />


              </div>
              <Button type='submit'>
                Register
              </Button>
            </div>

          </form>
        </div>
      </Card>
    </div>
  )
}
