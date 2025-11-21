import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  User,
  BarChart,
  FileCheck,
  Users,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  Bot,
  Zap,
  MenuIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <InnovationSection />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-[#0A192F] text-white sticky top-0 z-50 border-b border-blue-900/50">
      <Link href="/home" className="flex items-center justify-center">
        <GraduationCap className="h-6 w-6 text-blue-400" />
        <span className="ml-2 text-lg font-bold font-headline">RUAS EventHub+</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6 items-center">
        <Link href="#problem" className="text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          Problem
        </Link>
        <Link href="#solution" className="text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          Solution
        </Link>
        <Link href="#innovation" className="text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          Innovation
        </Link>
        <Link href="/login/student" className="flex items-center text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          <Users className="h-4 w-4 mr-1" />
          Student
        </Link>
        <Link href="/login/admin" className="flex items-center text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          <User className="h-4 w-4 mr-1" />
          Organizer
        </Link>
        <Link href="/login/admin" className="flex items-center text-sm font-medium hover:text-blue-300 transition-colors" prefetch={false}>
          <BarChart className="h-4 w-4 mr-1" />
          Admin
        </Link>
        <Button variant="outline" asChild className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-[#0A192F]">
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
    <section id="home" className="w-full py-20 md:py-32 lg:py-40 bg-[#0A192F]">
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
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0A192F]">
               <Link href="/admin/dashboard">View Admin Insights</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const problems = [
    {
      icon: Users,
      title: "Fragmented Communication",
      description: "Announcements are scattered across emails, social media, and department websites, leading to confusion and low participation.",
    },
    {
      icon: LayoutDashboard,
      title: "Lack of Centralization",
      description: "Students struggle to find relevant events, and organizers have no single platform to reach their target audience.",
    },
    {
      icon: FileCheck,
      title: "Manual Certificate Issuance",
      description: "A time-consuming and error-prone process for organizers, with no easy way for students to verify or store their certificates.",
    },
    {
      icon: BarChart3,
      title: "Limited Engagement Analytics",
      description: "Universities lack data on event attendance and skill development, making it hard to plan impactful events.",
    },
];

function ProblemSection() {
    return (
      <section id="problem" className="w-full py-20 md:py-32 bg-[#0A192F] text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">The Problem</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg">Event management in universities is often a fragmented and inefficient process for students, organizers, and administration alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem) => (
              <div key={problem.title} className="bg-[#112240] p-6 rounded-lg shadow-lg border border-blue-900/50 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 text-blue-400 mb-4">
                  <problem.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
                <p className="text-gray-400">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}

function SolutionSection() {
    return (
        <section id="solution" className="w-full py-20 md:py-32 bg-[#112240] text-gray-300">
            <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Our Solution</h2>
                        <p className="text-lg text-gray-400">RUAS EventHub+ is a unified, AI-powered platform that revolutionizes the entire event lifecycle. It centralizes event discovery, automates attendance and certification, and provides actionable insights for continuous improvement.</p>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Centralized Hub:</strong> A single source of truth for all university events.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">AI-Powered Features:</strong> Personalized recommendations and intelligent analytics.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                                <span><strong className="text-white">Secure & Verifiable:</strong> Immutable, blockchain-style certificates for all participants.</span>
                            </li>
                        </ul>
                         <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Link href="/dashboard">Explore Features</Link>
                        </Button>
                    </div>
                    <div>
                        <Image
                            src="https://picsum.photos/seed/solution/600/500"
                            alt="Solution Diagram"
                            width={600}
                            height={500}
                            data-ai-hint="digital platform dashboard"
                            className="rounded-lg shadow-2xl mx-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

const innovations = [
    {
        icon: ShieldCheck,
        title: "Blockchain-Style Certificates",
        description: "Secure, tamper-proof, and instantly verifiable digital certificates issued upon event completion, stored in a user's digital vault."
    },
    {
        icon: BrainCircuit,
        title: "AI Recommendation Engine",
        description: "Personalized event suggestions for students based on their course, interests, and past attendance, boosting engagement."
    },
    {
        icon: Bot,
        title: "AI-Powered Admin Tools",
        description: "Intelligent tools for organizers to suggest relevant student sections to invite, and analytics for admins to identify skill gaps."
    }
];

function InnovationSection() {
    return (
        <section id="innovation" className="w-full py-20 md:py-32 bg-[#0A192F] text-gray-300">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-headline">Key Innovations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {innovations.map((item) => (
                        <div key={item.title} className="text-center p-6 bg-[#112240] rounded-lg shadow-lg border border-blue-900/50">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 text-blue-400 mx-auto mb-4">
                                <item.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-blue-900/50 bg-[#0A192F] text-gray-400">
      <p className="text-xs">&copy; 2024 RUAS EventHub+. All rights reserved.</p>
      <div className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Terms of Service
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Privacy
        </Link>
         <a href="https://firebase.google.com/products/studio" target="_blank" rel="noopener noreferrer">
          <Badge className="bg-black text-white hover:bg-gray-800">
            <Zap className="w-3 h-3 mr-1.5 fill-yellow-400 text-yellow-400" />
            Made in Firebase Bolt
          </Badge>
        </a>
      </div>
    </footer>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

import { GraduationCap } from 'lucide-react';
