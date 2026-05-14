import React, { useState } from 'react'


export default function LoginPage() {

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
    console.log(data)

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
    <div>

      <h1>Login page</h1>

      <form >

        <input type='email'
          value={email}
          placeholder='Enter email'
          onChange={(event) => setEmail(event.target.value)}
        />

        <br />

        <input type="password"
          value={password}
          placeholder='Enter your password'
          onChange={(event) => setPassword(event.target.value)}
        />

        <br />

        <button type='button'
          onClick={
            handleAuthentication
          }
        >
          Login
        </button>

      </form>
    </div>
  )
}

