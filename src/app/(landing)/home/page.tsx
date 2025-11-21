import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Zap,
  LayoutDashboard,
  Calendar,
  Users,
  User,
  BarChart,
  FileCheck,
  BrainCircuit,
  ShieldCheck,
  QrCode,
  Map,
  FileText,
  Search,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur-sm lg:px-6">
      <Link href="/home" className="flex items-center gap-2 font-bold text-lg text-primary">
        EventHub+
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
        <Link href="/events" className="transition-colors hover:text-primary">
          Events
        </Link>
        <Link href="/student-dashboard" className="transition-colors hover:text-primary">
          Student Dashboard
        </Link>
        <Link href="/organizer-dashboard" className="transition-colors hover:text-primary">
          Organizer Dashboard
        </Link>
        <Link href="/admin-panel" className="transition-colors hover:text-primary">
          Admin Panel
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Login</Link>
        </Button>
         <Button asChild size="sm">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-48 bg-primary/5">
      <div className="container px-4 text-center">
        <div className="bg-accent/10 text-accent-foreground mx-auto mb-4 inline-block rounded-full border border-accent/20 px-4 py-1 text-sm font-medium">
          The Future of University Events is Here
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
          RUAS EventHub+
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Discover, register, attend, and verify your event participation—all in one seamless, intelligent platform.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/events">Explore Events <ChevronRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Organizer Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const features = [
    { icon: Search, title: "Unified Event Discovery", description: "Find all university events in one centralized, searchable hub." },
    { icon: FileCheck, title: "One-Tap Registration", description: "Register for any event instantly with a single click." },
    { icon: QrCode, title: "QR Attendance System", description: "Check in to events quickly and securely using a simple QR scan." },
    { icon: ShieldCheck, title: "Secure Certificates", description: "Receive and manage verifiable, tamper-proof event certificates." },
    { icon: BrainCircuit, title: "AI Recommendations", description: "Get personalized event suggestions from our smart EventBuddy AI." },
    { icon: BarChart, title: "Skill Gap Insights", description: "Administrators gain valuable insights into campus skill trends." },
    { icon: FileText, title: "Automated Reports", description: "Organizers can generate detailed event reports in seconds." },
    { icon: Map, title: "Map-Based Event View", description: "Visualize event locations across campus with an interactive map." },
]

function FeaturesSection() {
    return (
        <section id="features" className="w-full bg-background py-20 md:py-32">
            <div className="container px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl">A Smarter Way to Experience Campus Life</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">EventHub+ is more than just a calendar. It's an intelligent ecosystem designed to enhance every aspect of your university event experience.</p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-start text-left p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-shadow">
                            <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary">{feature.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


function AboutSection() {
    return (
        <section className="w-full bg-primary/5 py-20 md:py-32">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl">
                    About RUAS EventHub+
                </h2>
                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    EventHub+ fosters a vibrant, community-driven event culture at RUAS by providing a centralized platform for all university happenings. Our goal is to streamline event management, boost participation, and provide valuable insights into skill development across campus.
                </p>
            </div>
        </section>
    )
}

function Footer() {
  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t border-border/40 px-4 py-6 sm:flex-row md:px-6">
      <p className="text-xs text-muted-foreground">
        &copy; 2025 RUAS EventHub+. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-primary">
          Privacy Policy
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-primary">
          Contact
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-primary">
          Terms
        </Link>
      </nav>
    </footer>
  );
}
