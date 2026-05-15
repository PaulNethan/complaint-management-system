import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <nav className="bg-red-500 text-white text-5xl p-10">
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
