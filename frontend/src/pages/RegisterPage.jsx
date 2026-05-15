import React, { useState } from 'react'

export default function RegisterPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")

  const registerBackend = async () => {

    const response = await fetch("http://127.0.0.1:8000/api/register/", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: email,
        password: password,
        role: role
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

    await registerBackend()

    setEmail("")
    setPassword("")
  }

  return (
    <div>

      <h1>registter page</h1>

      <form >

        <button
          type='button'
          onClick={() => setRole("user")}
        >
          User register
        </button>

        <br />

        <button
          type='button'
          onClick={() => setRole("authority")}
        >
          Authority register
        </button>

        <br />

        <input type="email"
          value={email}
          placeholder='Enter email'
          onChange={(event) => setEmail(event.target.value)}
        />

        <br />

        <input
          type='password'
          value={password}
          placeholder='Enter Password'
          onChange={(event) => setPassword(event.target.value)}
        />

        <br />

        <button type='button'
          onClick={
            handleAuthentication
          }
        >
          Register
        </button>
      </form>
    </div>
  )
}
