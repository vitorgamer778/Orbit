import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="logo-mark">O</div>
      <p>404 · Lost in orbit</p>
      <h1>This workspace is out of range.</h1>
      <span>The page may have moved, but your project is still on course.</span>
      <Link href="/">Return to workspace</Link>
    </main>
  );
}
