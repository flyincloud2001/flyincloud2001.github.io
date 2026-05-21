import { useState, useEffect } from 'react'

export default function Background() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const style = {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#0a0c14',
  }

  if (isMobile) {
    return (
      <img
        src="/assets/phone web image.png"
        alt=""
        style={style}
        draggable={false}
      />
    )
  }

  return (
    <video
      style={style}
      src="/assets/desktop web video.mp4"
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
