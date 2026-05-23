import { useState, useEffect } from 'react'

export default function Background() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const wrapStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    background: '#0a0c14',
    filter: 'saturate(2) brightness(1.3)',
  }

  const mediaStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }

  if (isMobile) {
    return (
      <div style={wrapStyle}>
        <img
          src="/assets/phone web image.png"
          alt=""
          style={mediaStyle}
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <video
        style={mediaStyle}
        src="/assets/desktop web video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}
