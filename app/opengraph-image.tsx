import { ImageResponse } from 'next/og';

export const alt = 'Orbit — project operations, in flow';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        color: '#f8f7ff',
        background:
          'radial-gradient(circle at 75% 20%, #6447c7 0, #18132c 34%, #09090d 72%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 14,
            background: '#8b6cff',
          }}
        >
          O
        </span>
        Orbit
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div
          style={{
            fontSize: 76,
            lineHeight: 1.04,
            maxWidth: 900,
            fontWeight: 700,
            letterSpacing: -3,
          }}
        >
          Project operations, in flow.
        </div>
        <div style={{ fontSize: 29, color: '#bcb8ca' }}>
          A polished workspace for teams that move fast.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        {['Board', 'Cycles', 'Roadmap', 'Command menu'].map((label) => (
          <span
            key={label}
            style={{
              padding: '10px 18px',
              border: '1px solid #514b60',
              borderRadius: 99,
              fontSize: 20,
              color: '#d9d5e3',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>,
    size,
  );
}
