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
  FileText
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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-6">
      <Link href="/home" className="flex items-center gap-2 font-bold text-lg">
        RUAS EventHub+
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
        <Link href="/qr-scanner" className="transition-colors hover:text-primary">
          QR Scanner
        </Link>
        <Link href="/reports" className="transition-colors hover:text-primary">
          Reports
        </Link>
        <Link href="/admin-panel" className="transition-colors hover:text-primary">
          Admin Panel
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40">
       <Image
          src="https://picsum.photos/seed/campus-blur/1920/1080"
          alt="Blurred campus photo"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 -z-10 h-full w-full object-cover blur-sm brightness-50"
          data-ai-hint="blurred campus photo"
        />
      <div className="container px-4 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          RUAS EventHub+: The Smart Event Ecosystem
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-gray-200 md:text-xl">
          Discover. Register. Attend. Track. Verify. All in one place.
        </p>
        <div className="mt-8 space-x-4">
          <Button asChild size="lg">
            <Link href="/events">Explore Events</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/login">Organizer Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const features = [
    { icon: Calendar, title: "Unified Event Discovery" },
    { icon: FileCheck, title: "One-Tap Registration" },
    { icon: QrCode, title: "QR Attendance System" },
    { icon: ShieldCheck, title: "Blockchain-Style Certificates" },
    { icon: BrainCircuit, title: "EventBuddy Recommendations" },
    { icon: BarChart, title: "Skill Gap Insights" },
    { icon: FileText, title: "Automated Event Reports" },
    { icon: Map, title: "Map-Based Event View" },
]

function FeaturesSection() {
    return (
        <section className="w-full py-20 md:py-32">
            <div className="container px-4">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


function AboutSection() {
    return (
        <section className="w-full bg-muted py-20 md:py-32">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
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
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
      <p className="text-xs text-muted-foreground">
        &copy; 2025 RUAS EventHub+. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          Privacy Policy
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          Contact
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          Terms
        </Link>
      </nav>
    </footer>
  );
}
