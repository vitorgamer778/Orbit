import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link href="/">← Back to Orbit</Link>
      <div className="auth-orbit-mark">O</div>
      <h1>Terms of service</h1>
      <p>Last updated: September 3, 2026</p>
      <h2>Portfolio demonstration</h2>
      <p>
        Orbit is a portfolio project that demonstrates project-management
        interactions. Its workspace content is sample data and is not intended
        for production project storage.
      </p>
      <h2>Account access</h2>
      <p>
        Google sign-in is optional. You are responsible for access to your
        Google account and may end the Orbit session at any time.
      </p>
      <h2>Availability</h2>
      <p>
        The demo is provided as-is and may change as the portfolio evolves.
        Contact ytvitorgamer6@gmail.com with questions.
      </p>
    </main>
  );
}
