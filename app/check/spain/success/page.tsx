type PageProps = {
  searchParams: Promise<{
    payment?: string;
    tier?: string;
    session_id?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const { payment, tier, session_id } = await searchParams;

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Stripe Success Page Working</h1>

      <p>This page is rendering.</p>

      <p>
        <strong>payment:</strong> {payment ?? "missing"}
      </p>

      <p>
        <strong>tier:</strong> {tier ?? "missing"}
      </p>

      <p>
        <strong>session_id:</strong> {session_id ?? "missing"}
      </p>
    </main>
  );
}