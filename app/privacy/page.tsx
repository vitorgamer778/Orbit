import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/">← Back to Orbit</Link>
      <div className="auth-orbit-mark">O</div>
      <h1>Privacy policy</h1>
      <p>Last updated: September 3, 2026</p>
      <h2>Information we use</h2>
      <p>
        When you choose Google sign-in, Orbit receives your name, email address,
        and profile image from Google solely to create and display your session.
      </p>
      <h2>How information is handled</h2>
      <p>
        This portfolio demo uses an encrypted, short-lived authentication
        session. It does not sell personal information or use it for
        advertising. Demo issue data remains local to your browser.
      </p>
      <h2>Your choices</h2>
      <p>
        You can explore Orbit without an account and sign out at any time.
        Contact ytvitorgamer6@gmail.com with privacy questions.
      </p>
    </main>
  );
}
