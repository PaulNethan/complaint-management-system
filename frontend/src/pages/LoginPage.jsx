import { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

export default function LoginPage() {

  const cardRef = useRef(null);

  useGSAP(() => {

    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out"
    });
  }, { scope: cardRef })

  const navigate = useNavigate();

  const loginUsers = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: email,
        password: password
      })

    })

    const data = await response.json()
    if (data.token) {
      console.log("successful login");
      localStorage.setItem("token", data.token);

      if (data.role === "authority") {
        navigate("/authority");
      } else if (data.role === "user") {
        navigate("/user");
      } else if (data.role === "admin") {
        navigate("/admin");
      }

    }
    else {
      console.log("login failed", data.message, data.role);
    }

  }



  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleAuthentication = async (e) => {
    e.preventDefault()

    await loginUsers()

    console.log("email:", email)
    console.log("password:", password)
    setEmail("")
    setPassword("")
  }

  return (
    <div className='min-h-dvh min-w-dvw flex justify-center items-center bg-[#F7F8FC]'>

      <div ref={cardRef} className="w-full max-w-lg">
        <form onSubmit={handleAuthentication} >
          <Card >

            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>
                  Login to your account
                </CardTitle>
                <CardDescription>
                  Enter your email to login to your account
                </CardDescription>
              </div>

              <Button asChild variant="ghost" size='40'>
                <Link to="/register">sign up</Link>
              </Button>

            </CardHeader>

            <CardContent className="space-y-4">


              <div>
                <label htmlFor="email" className="block text-sm font-semibold tracking-tight text-slate-800 mb-2">
                  Email
                </label>

                <Input type="email" id="email" value={email} placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)}>
                </Input>

              </div>

              <div>
                <div className='flex justify-between'>

                  <label htmlFor="pass" className="block text-sm font-semibold tracking-tight text-slate-800 mb-2">Password</label>


                  <label htmlFor="pass">
                    <Button asChild variant='ghost'>
                      <Link to="/resetpassword">
                        Forgot your password?
                      </Link>
                    </Button></label>
                </div>


                <Input type="password" id="pass" value={password} onChange={(e) => setPassword(e.target.value)}>
                </Input>

              </div>



            </CardContent>

            <CardFooter className="flex flex-col items-center ">

              <Button className="w-full m-2.5 h-8 bg-white text-black " type="submit" >
                Login
              </Button>

              <Button className="w-full m-2.5 h-8" type="button">
                Login with Google
              </Button>
            </CardFooter>

          </Card>
        </form>
      </div>



    </div >
  )
}

