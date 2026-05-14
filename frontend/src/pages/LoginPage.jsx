import React, { useState } from 'react'


export default function LoginPage() {

  const testBackendConnection = async() => {
    
    const response = await fetch("http://127.0.0.1:8000/api/test/")

    const data = await response.json()
    console.log(data)
  }

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")

  const handleAuthentication = (e) => {
    e.preventDefault()

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
        onChange={(event)=> setEmail(event.target.value) }
        />

        <br/>

        <input type="password"
        value={password}
        placeholder='Enter your password'
        onChange={(event)=> setPassword(event.target.value)}
        />

        <br/>

        <button type='button'
        onClick={(e) => {handleAuthentication(e) 
          testBackendConnection()}
        }
        >
          Login
        </button>

      </form>
    </div>
  )
}

