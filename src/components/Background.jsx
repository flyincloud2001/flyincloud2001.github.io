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
    objectFit: 'cover',
    background: '#0a0c14',
  }

  return (
    <img
      src={isMobile ? "/assets/phone web image.webp" : "/assets/desktop web image.webp"}
      alt=""
      style={style}
      draggable={false}
      fetchPriority="high"
    />
  )
}
