import TrustBar from "@/components/TrustBar";

interface PageShellProps {
  children: React.ReactNode;
}

const PageShell = ({ children }: PageShellProps) => (
  <div className="min-h-screen bg-background text-foreground font-sans antialiased">
    <TrustBar />
    <main className="mx-auto max-w-[1100px] px-6 py-16">
      {children}
    </main>
  </div>
);

export default PageShell;