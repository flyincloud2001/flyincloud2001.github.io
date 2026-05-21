import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useLang } from '../context/LangContext'

export default function About() {
  const { t, lang }  = useLang()
  const subtitleRef  = useRef(null)
  const subtitle     = t('about', 'subtitle')

  // Typewriter effect — re-runs whenever language changes
  useEffect(() => {
    const el = subtitleRef.current
    if (!el) return
    el.textContent = ''
    const obj = { n: 0 }
    const tween = gsap.to(obj, {
      n: subtitle.length,
      duration: subtitle.length * 0.032,
      ease: 'none',
      onUpdate() {
        el.textContent = subtitle.slice(0, Math.round(obj.n))
      },
    })
    return () => tween.kill()
  }, [subtitle])

  return (
    <div style={{
      padding: '1rem clamp(1rem, 5vw, 2rem) 2rem clamp(1rem, 5.3vw, 64px)',
    }}>
      {/* Static main title */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 1.4rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        textAlign: 'left',
        textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
      }}>
        {t('about', 'title')}
      </h1>

      {/* Typewriter subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontSize: 'clamp(0.95rem, 2.1vw, 1.12rem)',
          lineHeight: 1.85,
          color: 'rgba(230,236,255,0.92)',
          maxWidth: '580px',
          margin: 0,
          textAlign: 'left',
          textShadow: '0 1px 10px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.85)',
          minHeight: '1.2em',
        }}
      />
    </div>
  )
}
