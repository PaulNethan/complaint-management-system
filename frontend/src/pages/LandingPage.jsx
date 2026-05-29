import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className='flex-col item-between'>
      <nav className="flex justify-between mx-10 border-b">
        <div>
          <p>logo</p>
        </div>

        <div className='flex gap-2.5'>

          <Link to="/register" className='p-2'>
            register
          </Link>

          <Link to="/login" className='p-2'>
            Login
          </Link>

        </div>
      </nav>
      <hero className='mx-16 my-7'>
        <h1>
          Your Safety Matters
        </h1>
        <p>A secure, confident, and efficient platform for women to report safety concerns, track progress and get help they need.</p>

        <Link to="/register">
          Report an incident
        </Link><br />
        <Link to="/login">
          Track Complaints
        </Link>
      </hero>

      <div className='badges flex gap-2.5'>

        <div className='badge1'>
          <p>icon</p>
          <h3>Secure Complaints</h3>
          <p>sub paragraph</p>
        </div>

        <div className='badge2'>
          <p>icon</p>
          <h3>Anonymous Reporting</h3>
          <p>sub paragraph</p>

        </div>

        <div className='badge3'>
          <p>icon</p>
          <h3>Evidence Upload</h3>
          <p>sub paragraph</p>

        </div>

        <div className='badge4'>
          <p>icon</p>
          <h3>Real-time Tracking</h3>
          <p>sub paragraph</p>

        </div>
      </div>

      <div className='footer flex justify-around'>

        <p>logo safe space</p>
        <p>
          privacy policy    Terms and Services    Contact support
        </p>
        <button>
          Emergency: 911
        </button>
      </div>
    </div>

  )
}
