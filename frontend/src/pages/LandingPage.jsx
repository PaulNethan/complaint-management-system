import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <nav>
      <p>logo</p>
      <div>

        <Link to="/register">
        <button >register</button>
        </Link>
        
        <Link to="/login">
          <button>Login</button>
        </Link>
        
      </div>
    </nav>
  )
}
