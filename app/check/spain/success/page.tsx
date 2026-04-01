"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const tier = searchParams.get("tier");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("no-session");
      return;
    }

    // OPTIONAL: later we verify via Stripe API
    setStatus("success");
  }, [sessionId]);

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Payment Successful</h1>

      {status === "loading" && <p>Processing your session...</p>}

      {status === "no-session" && (
        <p>No session detected. Please contact support.</p>
      )}

      {status === "success" && (
        <>
          <p>Your purchase has been confirmed.</p>

          <p><strong>Tier:</strong> ${tier}</p>
          <p><strong>Session ID:</strong> {sessionId}</p>

          <hr style={{ margin: "20px 0" }} />

          <h2>Your Resources</h2>

          {tier === "67" && (
            <ul>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_1" target="_blank">Download File 1</a></li>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_2" target="_blank">Download File 2</a></li>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_3" target="_blank">Download File 3</a></li>
            </ul>
          )}

          {tier === "147" && (
            <ul>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_1" target="_blank">Premium File 1</a></li>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_2" target="_blank">Premium File 2</a></li>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_3" target="_blank">Premium File 3</a></li>
              <li><a href="YOUR_GOOGLE_DRIVE_LINK_4" target="_blank">Premium File 4</a></li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}