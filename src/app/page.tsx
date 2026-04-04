'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bigPetals, setBigPetals] = useState<Array<{ left: string; delay: string; duration: string }>>([])
  const [smallPetals, setSmallPetals] = useState<Array<{ left: string; delay: string; duration: string }>>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  // 只在客户端生成随机值
  useEffect(() => {
    // 生成大花瓣
    const big = Array.from({ length: 6 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${8 + Math.random() * 5}s`,
    }))
    
    // 生成小花瓣
    const small = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
    }))
    
    setBigPetals(big)
    setSmallPetals(small)
  }, [])

  // 预加载视频
  useEffect(() => {
    const video = document.createElement('video')
    video.src = 'typhtv.mp4'
    video.preload = 'auto'
    video.muted = true
    video.loop = true

    const handleLoad = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      console.error('视频加载失败')
      setIsLoading(false)
    }

    video.addEventListener('loadeddata', handleLoad)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadeddata', handleLoad)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const handleClick = () => {
    if (isAnimating || isLoading) return
    
    setIsAnimating(true)
    
    // 确保视频在动画开始前已经准备好
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(err => console.error('视频播放失败:', err))
    }
    
    const animationDuration = 6000
    
    setTimeout(() => {
      router.push('/next-page')
    }, animationDuration)
  }

  return (
    <div
      className="home-container"
      onClick={handleClick}
      style={{ 
        cursor: isLoading ? 'default' : 'pointer'
      }}
    >
      <img
        src="/bg/typh-bg.jpg"
        alt="background"
        className="bg-image"
      />
      <div className="blur-right" />
      <div className="petals">
        {bigPetals.map((petal, i) => (
          <div key={`big-${i}`} className="petal petal-big" style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }} />
        ))}
        {smallPetals.map((petal, i) => (
          <div key={i} className={`petal petal-${i % 5}`} style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }} />
        ))}
      </div>
      <div className="hint-text">Click anywhere to enter the next step</div>
      
      {/* 加载指示器 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
      
      {/* 视频切换动画 */}
      {isAnimating && (
        <div className="video-transition">
          <video
            ref={videoRef}
            src="typhtv.mp4"
            autoPlay
            muted
            loop
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      )}
    </div>
  )
}
