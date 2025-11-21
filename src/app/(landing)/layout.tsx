export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A192F] text-gray-300 scroll-smooth">
      {children}
    </div>
  );
}
