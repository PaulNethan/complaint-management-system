import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Shield, ArrowRight, Lock, EyeOff, UploadCloud, Activity, } from 'lucide-react'

export default function LandingPage() {

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from("nav", {
      y: -50,
      opacity: 0,
      duration: 1.0,
      ease: "power2.out"
    });

    tl.from("section > *", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      easer: "power2.out"
    }, "-0.5")
  })
  return (
    <div className='flex flex-col justify-between min-h-screen bg-[#F7F8FC]'>
      <nav className="flex justify-between items-center  py-5 px-28 bg-[#FDFEFE]">
        <div className='flex items-center gap-2'>
          <div className=' text-white p-2 bg-[#452FDC] rounded-xl '>
            <Shield />

          </div>
          <span className='font-bold text-xl'>SafeSpace</span>
        </div>

        <div className='flex gap-2.5 items-center'>

          <Button asChild variant="outline">
            <Link to="/login" className=' px-4 opacity-85'>
              Login
            </Link>
          </Button>


          <Button asChild variant="default">
            <Link to="/register" className=' px-4 bg-[#452FDC] rounded-2xl  py-2'>
              register
            </Link>
          </Button>


        </div>
      </nav>


      <section className='flex flex-col items-center min-h-50 mb-40 mt-40  mx-68 text-center'>
        <div className='flex gap-4'>
          <h1 className='text-6xl font-extrabold tracking-tight  '>
            Your Safety
          </h1>
          <span className="text-[#4F39F6] text-6xl font-extrabold tracking-tight ">Matters</span>
        </div>


        <p className='opacity-75 py-8 max-w-xl m-auto'>A secure, confident, and efficient platform for women to report safety concerns,
          track progress and get help they need.</p>

        <div className='flex gap-4'>
          <Button asChild variant="default">
            <Link to="/register" >
              Report an incident
              <ArrowRight />
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link to="/login" >
              Track Complaints
            </Link>
          </Button>

        </div>

      </section>

      <div className='badges flex justify-around gap-5 py-5 px-28 mb-20 '>


        <Card className="flex-1 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className='text-[#4F39F6] bg-[#EEF2FF] rounded-xl w-fit p-3'>
              <Lock size={24} />
            </div>

            <CardTitle className="text-lg font-medium">
              Secure Complaints
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-500 max-w-xl">
            Your data is encrypted and stored securely. Only authorized personnel can access it.
          </CardContent>
        </Card>


        <Card className="flex-1 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className='text-[#4F39F6] bg-[#EEF2FF] rounded-xl w-fit p-3'>
              <EyeOff size={24} />
            </div>

            <CardTitle className="text-lg font-medium">
              Anonymous Reporting
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-500 max-w-xl">
            Option to hide your identity while reporting sensitive incidents.
          </CardContent>
        </Card>

        <Card className="flex-1 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className='text-[#4F39F6] bg-[#EEF2FF] rounded-xl w-fit p-3'>
              <UploadCloud size={24} />
            </div>

            <CardTitle className="text-lg font-medium">
              Evidence Upload
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-500 max-w-xl">
            Easily attach photos, videos, or documents to support your complaint.
          </CardContent>
        </Card>


        <Card className="flex-1 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className='text-[#4F39F6] bg-[#EEF2FF] rounded-xl w-fit p-3'>
              <Activity size={24} />
            </div>

            <CardTitle className="text-lg font-medium">
              Real-time Tracking
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-slate-500 max-w-xl">
            Get instant updates on the status and progress of your reported complaints.
          </CardContent>
        </Card>


      </div>

      <div className='footer flex justify-between items-center py-5 px-28 bg-[#FDFEFE]'>

        <div className='flex gap-2'>
          <div className='text-[#4F39F6] bg-[#EEF2FF] rounded-xl w-fit flex items-center justify-center p-3'>

            <Shield />
          </div>
          <span className='font-bold'>SafeSpace</span>
        </div>

        <div className='flex gap-6 opacity-70 text-xs'>
          <p>privacy policy</p>
          <p>Terms and Services</p>
          <p>Contact support</p>
        </div>


        {/* not yet implemented*/}
        <Button variant="destructive">
          Emergency: 911
        </Button>
      </div>
    </div>

  )
}
