'use client'

import { useRouter, useTransition } from 'next/navigation'
import { useState } from 'react'

export default function NextPage() {
  const router = useRouter()
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [buttonClicks, setButtonClicks] = useState<Record<string, number>>({})

  const handleButtonClick = (path: string, button: string) => {
    const currentClicks = buttonClicks[button] || 0
    
    if (currentClicks === 0) {
      // 第一次点击：只设置选中状态
      setActiveButton(button)
      setButtonClicks(prev => ({
        ...prev,
        [button]: 1
      }))
    } else {
      // 第二次点击：跳转页面
      if (path.startsWith('http')) {
        // 外部链接
        window.open(path, '_blank')
      } else {
        // 内部链接
        router.push(path)
      }
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <video
        src="/4月4日 (5)(2).mp4"
        autoPlay
        muted
        loop
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      <div className="blur-left" />
      <div className="blur-right" />
      
      <div className="button-container">
        <button 
          className={`action-button ${activeButton === 'introduce' ? 'active' : ''}`}
          onClick={() => handleButtonClick('https://animation-meme.fandom.com/wiki/Typh', 'introduce')}
        >
          T Y P H &nbsp; I N T R O D U C E
        </button>
        <button 
          className={`action-button ${activeButton === 'role' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/typh/typh_role', 'role')}
        >
          T Y P H &nbsp; R O L E
        </button>
        <button 
          className={`action-button ${activeButton === 'comment' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/typh/comment', 'comment')}
        >
          C O M M E N T
        </button>
        <button 
          className={`action-button ${activeButton === 'developer' ? 'active' : ''}`}
          onClick={() => handleButtonClick('/typh/developer', 'developer')}
        >
          D E V E L O P E R
        </button>
      </div>
    </div>
  )
}
