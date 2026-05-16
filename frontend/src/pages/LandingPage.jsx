import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <nav className="header h-full w-fit bg-amber-300 flex justify-between">
      <div>
        <p>logo</p>
      </div>

      <div className=' flex w-fit h-full bg-amber-500 align-middle justify-center'>

        <Link to="/register">
          register
        </Link>

        <Link to="/login">
          Login
        </Link>

      </div>
    </nav>
  )
}
