import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

export default function ContentPanel({ children }) {
  const location = useLocation()
  const innerRef  = useRef(null)

  useEffect(() => {
    if (!innerRef.current) return
    gsap.fromTo(
      innerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  }, [location.pathname])

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: 0, right: 0, bottom: 0,
      zIndex: 10,
      overflow: 'hidden auto',
      padding: '2.5rem 0 2.5rem 0',
    }}>
      <div
        ref={innerRef}
        style={{
          width: '100%',
          color: '#e8edf8',
        }}
      >
        {children}
      </div>
    </div>
  )
}
