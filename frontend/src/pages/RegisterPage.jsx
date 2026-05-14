import React, {useState} from 'react'

export default function RegisterPage() {
  
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")

    const handleAuthentication = (e) =>{
      e.preventDefault();
      console.log("email:",email)
      console.log("password:",password)
      setEmail("")
      setPassword("")
    }

  return (
    <div>

      <h1>registter page</h1>

      <form >

        <input type="email"
        value={email}
        placeholder='Enter email'
        onChange={(event) => setEmail(event.target.value)}
        />

        <br/>

        <input
        type='password'
        value={password}
        placeholder='Enter Password'
        onChange={(event) => setPassword(event.target.value)}
        />

        <br/>

        <button type='submit'
        onClick={handleAuthentication}
        >Register</button>
      </form>
    </div>
  )
}
