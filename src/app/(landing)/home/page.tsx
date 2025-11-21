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
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-48 bg-gray-50">
       <div className="absolute inset-0 z-0">
         <Image 
          src="/assets/demo-photo.png"
          alt="Blurred campus background"
          fill
          className="object-cover opacity-10 filter blur-sm"
         />
       </div>
      <div className="container relative z-10 px-4 text-center">
        <div className="bg-primary/10 text-primary mx-auto mb-4 inline-block rounded-full border border-primary/20 px-4 py-1 text-sm font-medium">
          The Future of University Events is Here
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          RUAS EventHub+: The Smart Event Ecosystem
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Discover. Register. Attend. Track. Verify. All in one place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-secondary text-primary-foreground">
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
    { icon: ShieldCheck, title: "Blockchain-Style Certificates", description: "Receive and manage verifiable, tamper-proof event certificates." },
    { icon: BrainCircuit, title: "EventBuddy Recommendations", description: "Get personalized event suggestions from our smart EventBuddy AI." },
    { icon: BarChart, title: "Skill Gap Insights", description: "Administrators gain valuable insights into campus skill trends." },
    { icon: FileText, title: "Automated Reports", description: "Organizers can generate detailed event reports in seconds." },
    { icon: Map, title: "Map-Based Event View", description: "Visualize event locations across campus with an interactive map." },
]

function FeaturesSection() {
    return (
        <section id="features" className="w-full bg-white py-20 md:py-32">
            <div className="container px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">A Smarter Way to Experience Campus Life</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">EventHub+ is more than just a calendar. It's an intelligent ecosystem designed to enhance every aspect of your university event experience.</p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-start text-left p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                            <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
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
        <section className="w-full bg-gray-50 py-20 md:py-32">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">
                    About RUAS EventHub+
                </h2>
                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                    EventHub+ fosters a vibrant, community-driven event culture at RUAS by providing a centralized platform for all university happenings. Our goal is to streamline event management, boost participation, and provide valuable insights into skill development across campus.
                </p>
            </div>
        </section>
    )
}
