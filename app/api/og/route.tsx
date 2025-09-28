import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

function truncate(s: string, n = 140) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('t') || 'Stacker News';
  const subtitle = searchParams.get('s') || 'Latest post';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'white',
          padding: 48,
        }}
      >
        <div style={{ fontSize: 36 }}>SN → Farcaster</div>
        <div style={{ fontSize: 56, fontWeight: 700, marginTop: 16, maxWidth: 1100 }}>
          {truncate(title, 120)}
        </div>
        <div style={{ fontSize: 32, opacity: 0.6, marginTop: 16 }}>{truncate(subtitle, 80)}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}