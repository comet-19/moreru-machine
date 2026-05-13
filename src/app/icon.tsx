import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 壁取り付けプレート */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            left: 8,
            width: 16,
            height: 2,
            background: '#71717a',
            borderRadius: 1,
          }}
        />
        {/* 便器本体 */}
        <div
          style={{
            position: 'absolute',
            top: 7,
            left: 8,
            width: 16,
            height: 20,
            background: '#e4e4e7',
            borderRadius: '2px 2px 50% 50% / 2px 2px 40% 40%',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
