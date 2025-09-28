export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>SN ↔ Farcaster Frame (MVP)</h1>
      <p>Endpoints útiles:</p>
      <ul>
        <li><code>/frame</code> — Farcaster Frame (lee home RSS)</li>
        <li><code>/frame?territory=bitcoin</code> — Frame con territorio ~bitcoin</li>
        <li><code>/api/sn/rss</code> — JSON feed (home)</li>
        <li><code>/api/sn/rss?territory=bitcoin</code> — JSON feed (territorio)</li>
        <li><code>/onboarding/sn</code> — Landing de onboarding a Stacker News</li>
      </ul>
    </main>
  );
}