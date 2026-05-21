import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function MainScene() {
  const mountRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const mount = mountRef.current
    if (!mount) return

    const w = window.innerWidth
    const h = window.innerHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0c14')

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ canvas: mount, antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const COUNT = 200
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      speeds[i] = 0.003 + Math.random() * 0.005
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)

      const pos = geometry.attributes.position.array
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] -= speeds[i]
        if (pos[i * 3 + 1] < -8) {
          pos[i * 3 + 1] = 8
          pos[i * 3]     = (Math.random() - 0.5) * 22
        }
      }
      geometry.attributes.position.needsUpdate = true

      particles.rotation.x += (mouseY * 0.04 - particles.rotation.x) * 0.04
      particles.rotation.y += (mouseX * 0.04 - particles.rotation.y) * 0.04

      renderer.render(scene, camera)
    }
    animate()

    const onWindowResize = () => {
      const nw = window.innerWidth
      const nh = window.innerHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onWindowResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onWindowResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [isMobile])

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        background: '#0a0c14',
      }} />
    )
  }

  return (
    <canvas
      ref={mountRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'block',
      }}
    />
  )
}
