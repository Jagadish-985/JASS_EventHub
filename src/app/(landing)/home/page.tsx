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
  ChevronRight,
  ClipboardCheck,
  Presentation
} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SolutionSection />
        <ProblemSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 bg-card border-b">
       <div className="absolute inset-0 z-0 opacity-5">
         <Image 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
          alt="Blurred campus background"
          fill
          className="object-cover"
          data-ai-hint="university campus"
         />
       </div>
      <div className="container relative z-10 px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
          RUAS EventHub+
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
          The Smart Event Ecosystem for a Connected Campus.
          <br />
          Discover. Register. Attend. Verify. All in one place.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/events">Explore Events <ChevronRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/login">Organizer & Admin Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const features = [
    { icon: Search, title: "Unified Event Discovery", description: "Find all university events in one centralized, searchable hub." },
    { icon: ClipboardCheck, title: "One-Tap Registration", description: "Register for any event instantly with a single click." },
    { icon: QrCode, title: "QR Attendance System", description: "Check in to events quickly and securely using a simple QR scan." },
    { icon: ShieldCheck, title: "Verifiable Certificates", description: "Receive and manage verifiable, tamper-proof event certificates." },
    { icon: BrainCircuit, title: "EventBuddy AI", description: "Get personalized event suggestions and administrative insights." },
    { icon: BarChart, title: "Skill Gap Analytics", description: "Gain valuable insights into campus skill trends and event ROI." },
    { icon: FileText, title: "Automated Reports", description: "Organizers can generate detailed, geotagged event reports in seconds." },
    { icon: Map, title: "Campus Event Map", description: "Visualize event locations across campus with an interactive map." },
]

function FeaturesSection() {
    return (
        <section id="features" className="w-full bg-background py-20 md:py-28">
            <div className="container px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">A Smarter Way to Experience Campus Life</h2>
                    <p className="mx-auto mt-3 max-w-3xl text-foreground/70 md:text-lg">EventHub+ is more than just a calendar. It's an intelligent ecosystem designed to enhance every aspect of your university event experience, from discovery to certification.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col text-left p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary w-fit">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                            <p className="mt-1 text-sm text-foreground/60">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function SolutionSection() {
    return (
        <section className="w-full bg-card py-20 md:py-28 border-y">
            <div className="container px-4 grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">The All-in-One Solution</h2>
                    <p className="mt-4 text-foreground/70 text-lg">
                        RUAS EventHub+ centralizes event management, participation, and analytics into a single, seamless platform. For students, it's a personalized gateway to campus life. For organizers and admins, it's a powerful tool for planning, execution, and data-driven decision-making.
                    </p>
                    <ul className="mt-6 space-y-4 text-foreground/80">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-accent mt-1"/>
                            <span>**For Students:** Effortlessly discover, register, and attend events. Earn verifiable certificates to showcase your skills.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-accent mt-1"/>
                            <span>**For Organizers:** Streamline event creation, manage registrations, automate attendance, and generate reports instantly.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-accent mt-1"/>
                            <span>**For Admins:** Access real-time analytics on event engagement, skill gaps, and ROI to inform strategic university planning.</span>
                        </li>
                    </ul>
                </div>
                <div className="order-1 md:order-2">
                    <Image 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                        alt="Students collaborating"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-xl"
                        data-ai-hint="students collaborating"
                    />
                </div>
            </div>
        </section>
    );
}

function ProblemSection() {
    return (
        <section className="w-full bg-background py-20 md:py-28">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl text-destructive/80">The Fragmentation Problem</h2>
                <p className="mx-auto mt-4 max-w-3xl text-foreground/70 md:text-lg">
                    Disjointed systems for event discovery, registration, and attendance tracking lead to missed opportunities, low engagement, and a lack of data-driven insights for university administration. Students struggle to find relevant events, while organizers face manual, error-prone processes.
                </p>
                <div className="mt-8 grid sm:grid-cols-3 gap-6 text-left">
                    <div className="p-6 bg-card border rounded-lg">
                        <h4 className="font-bold text-destructive">Siloed Information</h4>
                        <p className="text-sm text-foreground/60 mt-1">Events are scattered across posters, emails, and social media, making discovery difficult for students.</p>
                    </div>
                    <div className="p-6 bg-card border rounded-lg">
                        <h4 className="font-bold text-destructive">Manual Processes</h4>
                        <p className="text-sm text-foreground/60 mt-1">Organizers waste time with paper-based attendance and manual certificate creation.</p>
                    </div>
                    <div className="p-6 bg-card border rounded-lg">
                        <h4 className="font-bold text-destructive">No Actionable Data</h4>
                        <p className="text-sm text-foreground/60 mt-1">Administration lacks clear insights into which events are impactful and what skills are in demand.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AboutSection() {
    return (
        <section className="w-full bg-primary text-primary-foreground py-20 md:py-28">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">
                    About RUAS EventHub+
                </h2>
                <p className="mx-auto mt-4 max-w-3xl md:text-xl text-primary-foreground/80">
                    EventHub+ fosters a vibrant, community-driven event culture at RUAS by providing a centralized platform for all university happenings. Our goal is to streamline event management, boost participation, and provide valuable insights into skill development across campus.
                </p>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="bg-card border-t py-6">
            <div className="container px-4 text-center text-sm text-muted-foreground">
                 © {new Date().getFullYear()} RUAS EventHub+. All Rights Reserved.
            </div>
        </footer>
    )
}

function CheckCircle({className}: {className?: string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    )
}
