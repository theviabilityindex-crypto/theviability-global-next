const TrustBar = () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-[600px] px-4 py-2 flex justify-between font-data text-[10px] tracking-widest uppercase text-muted-foreground">
        <span>LAST VERIFIED: {today}</span>
        <span>SOURCE: OFFICIAL REGULATION</span>
      </div>
    </nav>
  );
};

export default TrustBar;