import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, User, BarChart, FileCheck, Users, BrainCircuit, Bot, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-[#0A192F] text-white sticky top-0 z-50">
      <Link href="/home" className="flex items-center justify-center">
        <Calendar className="h-6 w-6 text-blue-400" />
        <span className="ml-2 text-lg font-bold font-headline">RUAS EventHub+</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6 items-center">
        <Link href="#" className="text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          Problem
        </Link>
        <Link href="#" className="text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          Solution
        </Link>
        <Link href="#" className="text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          Innovation
        </Link>
        <Link href="/login" className="flex items-center text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          <Users className="h-4 w-4 mr-1" />
          Student
        </Link>
        <Link href="/login" className="flex items-center text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          <User className="h-4 w-4 mr-1" />
          Organizer
        </Link>
        <Link href="/login" className="flex items-center text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          <BarChart className="h-4 w-4 mr-1" />
          Admin
        </Link>
        <Button variant="default" asChild className="bg-blue-500 hover:bg-blue-600 text-white">
          <Link href="#">
            Verify Certificate
          </Link>
        </Button>
      </nav>
      <Button variant="ghost" size="icon" className="ml-auto lg:hidden">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-[#0A192F]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white font-headline">
              RUAS EventHub+
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
              A Smart Event Ecosystem with Blockchain-Style Certificates, AI Recommendations, Analytics, and Automated Reporting
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Link href="/dashboard">Open Student Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white text-[#0A192F] hover:bg-gray-200">
               <Link href="/dashboard">View Admin Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex items-center justify-end p-4">
        <a href="https://firebase.google.com/products/studio" target="_blank" rel="noopener noreferrer">
          <Badge className="bg-black text-white hover:bg-gray-800">
            <Zap className="w-3 h-3 mr-1.5 fill-yellow-400 text-yellow-400" />
            Made in Bolt
          </Badge>
        </a>
    </footer>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
