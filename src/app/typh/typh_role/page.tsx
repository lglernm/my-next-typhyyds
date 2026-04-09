'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Satellite from '@/components/Satellite'

export default function TyphRole() {
  const [isActivated, setIsActivated] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [activeSatellite, setActiveSatellite] = useState<string | null>(null)
  const [showMascotsSubSatellites, setShowMascotsSubSatellites] = useState(false)
  const [isTrackingMascots, setIsTrackingMascots] = useState(false)
  const [trackingOffset, setTrackingOffset] = useState({ x: 0, y: 0 })
  const [selectedMascot, setSelectedMascot] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState<'name' | 'introduce' | 'chat' | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([])

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('hasRefreshed')
    if (!hasRefreshed) {
      sessionStorage.setItem('hasRefreshed', 'true')
      window.location.reload()
    }
  }, [])

  const handleImageClick = () => {
    if (isActivated) {
      setIsDeactivating(true)
      setTimeout(() => {
        setIsActivated(false)
        setIsDeactivating(false)
        setShowMascotsSubSatellites(false)
        setSelectedMascot(null)
        setShowPanel(null)
      }, 500)
    } else {
      setIsActivated(true)
    }
  }

  const handleSatelliteClick = (label: string) => {
    if (label === 'mascots') {
      const newState = activeSatellite !== 'mascots'
      setActiveSatellite(newState ? 'mascots' : null)
      setShowMascotsSubSatellites(newState)
      setIsTrackingMascots(newState)
      
      if (newState) {
        const mascotsX = window.innerWidth / 2 + 380
        const mascotsY = window.innerHeight / 2 - 200
        const offsetX = window.innerWidth / 2 - mascotsX
        const offsetY = window.innerHeight / 2 - mascotsY
        setTrackingOffset({ x: offsetX, y: offsetY })
      } else {
        setTrackingOffset({ x: 0, y: 0 })
        setSelectedMascot(null)
        setShowPanel(null)
        setIsTrackingMascots(false) // 恢复主星追踪状态
      }
      
      console.log(`Mascots satellite clicked: ${newState ? 'showing sub-satellites' : 'hiding sub-satellites'}`)
    } else if (['mascot-1', 'mascot-2', 'mascot-3'].includes(label)) {
      // 如果点击的是当前已选中的子卫星，则关闭面板并恢复星链；否则打开新面板并追踪
      if (selectedMascot === label && showPanel) {
        setSelectedMascot(null)
        setShowPanel(null)
        // 关闭面板时，回到屏幕中心，星链会自动正确连接
        setTrackingOffset({ x: 0, y: 0 })
        setIsTrackingMascots(false)
        console.log(`${label} clicked, hiding panel and restoring star link`)
      } else {
        setSelectedMascot(label)
        setShowPanel('name')
        // 计算卫星和弹窗中间位置并追踪
        const satelliteAndPanelPositions = {
          'mascot-1': { satelliteX: 780, satelliteY: -700, panelOffsetX: 550, panelOffsetY: 0 },
          'mascot-2': { satelliteX: 950, satelliteY: -350, panelOffsetX: 675, panelOffsetY: 0 },
          'mascot-3': { satelliteX: 820, satelliteY: 100, panelOffsetY: 0, panelOffsetX: 575 },
        }
        const pos = satelliteAndPanelPositions[label as keyof typeof satelliteAndPanelPositions]
        // 卫星的绝对位置（相对于屏幕中心）
        const absSatelliteX = window.innerWidth / 2 + pos.satelliteX
        const absSatelliteY = window.innerHeight / 2 + pos.satelliteY
        // 面板的绝对位置（卫星右侧）
        const absPanelX = absSatelliteX + pos.panelOffsetX
        const absPanelY = absSatelliteY + pos.panelOffsetY
        // 计算中间点
        const centerX = (absSatelliteX + absPanelX) / 2
        const centerY = (absSatelliteY + absPanelY) / 2
        // 计算追踪偏移量（使中间点居中）
        const offsetX = window.innerWidth / 2 - centerX
        const offsetY = window.innerHeight / 2 - centerY
        setTrackingOffset({ x: offsetX, y: offsetY })
        setIsTrackingMascots(true) // 保持追踪效果开启
        console.log(`${label} clicked, tracking to center of satellite and panel`)
      }
    } else {
      setActiveSatellite(label === activeSatellite ? null : label)
      console.log(`Satellite clicked: ${label}`)
    }
  }

  const handlePanelAction = (action: 'name' | 'introduce' | 'chat') => {
    setShowPanel(action)
    console.log(`Panel changed to: ${action}`)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput, isUser: true }])
      setChatInput('')
      
      setTimeout(() => {
        const responses = [
          `你好！我是${selectedMascot}的回复`,
          '很高兴见到你！',
          '有什么我可以帮助你的吗？',
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }])
      }, 1000)
    }
  }

  const handleClosePanel = () => {
    setSelectedMascot(null)
    setShowPanel(null)
    setChatMessages([])
  }

  const handleReturn = () => {
    sessionStorage.removeItem('hasRefreshed')
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0e1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transform: isTrackingMascots ? `translate(${trackingOffset.x * 0.3}px, ${trackingOffset.y * 0.3}px)` : 'none',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      suppressHydrationWarning
    >
      {/* 星空背景 */}
      <div className="stars-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              position: 'absolute',
              width: Math.random() > 0.5 ? '2px' : '1px',
              height: Math.random() > 0.5 ? '2px' : '1px',
              background: `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
              animation: `star-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.5,
            }}
          />
        ))}
      </div>

      <Link
        href="/next-page"
        onClick={handleReturn}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, rgba(255, 215, 100, 0.15) 0%, rgba(255, 230, 140, 0.25) 50%, rgba(255, 200, 80, 0.15) 100%)',
          border: '2px solid rgba(255, 215, 100, 0.5)',
          borderRadius: '8px',
          color: 'rgba(255, 230, 140, 0.9)',
          fontSize: '16px',
          fontWeight: '600',
          letterSpacing: '1px',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 0 15px rgba(255, 215, 100, 0.3), inset 0 0 10px rgba(255, 230, 140, 0.1)',
          backdropFilter: 'blur(10px)',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Return
      </Link>

      {isActivated && (
        <>
          <div className="audio-bar bar-1" suppressHydrationWarning />
          <div className="audio-bar bar-2" suppressHydrationWarning />
          <div className="audio-bar bar-3" suppressHydrationWarning />
          <div className="audio-bar bar-4" suppressHydrationWarning />
          <div className="audio-bar bar-5" suppressHydrationWarning />
          <div className="audio-bar bar-6" suppressHydrationWarning />
          <div className="audio-bar bar-7" suppressHydrationWarning />
          <div className="audio-bar bar-8" suppressHydrationWarning />
          <div className="audio-bar bar-9" suppressHydrationWarning />
          <div className="audio-bar bar-10" suppressHydrationWarning />
          <div className="audio-bar bar-11" suppressHydrationWarning />
          <div className="audio-bar bar-12" suppressHydrationWarning />
          <div className="audio-bar bar-13" suppressHydrationWarning />
          <div className="audio-bar bar-14" suppressHydrationWarning />
          <div className="audio-bar bar-15" suppressHydrationWarning />
          <div className="audio-bar bar-16" suppressHydrationWarning />
          <div className="audio-bar bar-17" suppressHydrationWarning />
          <div className="audio-bar bar-18" suppressHydrationWarning />
          <div className="audio-bar bar-19" suppressHydrationWarning />
          <div className="audio-bar bar-20" suppressHydrationWarning />
        </>
      )}

      {isActivated && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'auto' }}>
          <Satellite 
                top="calc(50% - 200px)" 
                left="calc(50% + 380px)" 
                label="mascots"
                appearDelay="0.2s"
                pulseDelay="1s"
                isDeactivating={isDeactivating}
                isActive={activeSatellite === 'mascots'}
                isTracking={isTrackingMascots}
                onClick={() => handleSatelliteClick('mascots')}
              />
          <Satellite 
            top="calc(50% - 200px)" 
            left="calc(50% - 380px)" 
            label="sonas"
            appearDelay="0.1s"
            pulseDelay="0.5s"
            isDeactivating={isDeactivating}
            isActive={activeSatellite === 'sonas'}
            onClick={() => handleSatelliteClick('sonas')}
          />
          <Satellite 
            top="calc(50% + 350px)" 
            left="calc(50% - 300px)" 
            label="general"
            appearDelay="0.3s"
            pulseDelay="1.5s"
            isDeactivating={isDeactivating}
            isActive={activeSatellite === 'general'}
            onClick={() => handleSatelliteClick('general')}
          />
          <Satellite 
            top="calc(50% + 320px)" 
            left="calc(50% + 330px)" 
            label="pokemon"
            appearDelay="0.4s"
            pulseDelay="2s"
            isDeactivating={isDeactivating}
            isActive={activeSatellite === 'pokemon'}
            onClick={() => handleSatelliteClick('pokemon')}
          />

          {/* Mascots 子卫星 */}
          {showMascotsSubSatellites && (
            <>
              <Satellite 
                top="calc(50% - 700px)" 
                left="calc(50% + 780px)" 
                label="mascot-1"
                appearDelay="0.3s"
                pulseDelay="1.2s"
                isDeactivating={isDeactivating}
                isSubSatellite={true}
                showConnection={!selectedMascot}
                connectionTarget={{ top: "calc(50% - 200px)", left: "calc(50% + 380px)" }}
                satelliteImage="/mascot-1.png"
                onClick={() => handleSatelliteClick('mascot-1')}
              />
              <Satellite 
                top="calc(50% - 350px)" 
                left="calc(50% + 950px)" 
                label="mascot-2"
                appearDelay="0.4s"
                pulseDelay="1.4s"
                isDeactivating={isDeactivating}
                isSubSatellite={true}
                showConnection={!selectedMascot}
                connectionTarget={{ top: "calc(50% - 200px)", left: "calc(50% + 380px)" }}
                satelliteImage="/mascot-2.png"
                onClick={() => handleSatelliteClick('mascot-2')}
              />
              <Satellite 
                top="calc(50% + 100px)" 
                left="calc(50% + 820px)" 
                label="mascot-3"
                appearDelay="0.5s"
                pulseDelay="1.6s"
                isDeactivating={isDeactivating}
                isSubSatellite={true}
                showConnection={!selectedMascot}
                connectionTarget={{ top: "calc(50% - 200px)", left: "calc(50% + 380px)" }}
                satelliteImage="/mascot-3.png"
                onClick={() => handleSatelliteClick('mascot-3')}
              />
            </>
          )}
        </div>
      )}

      {/* 交互面板 */}
      {showMascotsSubSatellites && selectedMascot && showPanel && (
        <div
          style={{
            position: 'fixed',
            top: selectedMascot === 'mascot-1' ? 'calc(50% - 700px)' : 
                   selectedMascot === 'mascot-2' ? 'calc(50% - 350px)' : 
                   'calc(50% + 100px)',
            left: selectedMascot === 'mascot-1' ? 'calc(50% + 1100px)' : 
                   selectedMascot === 'mascot-2' ? 'calc(50% + 1350px)' : 
                   'calc(50% + 1150px)',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(10, 14, 26, 1)',
            border: '2px solid rgba(255, 215, 100, 0.5)',
            borderRadius: '20px',
            padding: '30px',
            minWidth: '400px',
            maxWidth: '500px',
            boxShadow: '0 0 40px rgba(255, 215, 100, 0.3), 0 0 80px rgba(255, 200, 80, 0.2)',
            zIndex: 1000,
          }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={handleClosePanel}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 215, 100, 0.8)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Name 面板 */}
          {showPanel === 'name' && (
            <div>
              <h2 style={{ 
                color: 'rgba(255, 220, 120, 1)', 
                fontSize: '28px', 
                marginBottom: '20px',
                textAlign: 'center',
                textShadow: '0 0 20px rgba(255, 220, 120, 0.5)',
              }}>
                {selectedMascot === 'mascot-1' ? 'MIMI' : 
                 selectedMascot === 'mascot-2' ? 'HAZEL' : 'ANGEL'}
              </h2>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
                <button
                  onClick={() => handlePanelAction('introduce')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 215, 100, 0.2)',
                    border: '1px solid rgba(255, 215, 100, 0.5)',
                    color: 'rgba(255, 220, 120, 1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 100, 0.3)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 215, 100, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 100, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  介绍
                </button>
                <button
                  onClick={() => handlePanelAction('chat')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 215, 100, 0.2)',
                    border: '1px solid rgba(255, 215, 100, 0.5)',
                    color: 'rgba(255, 220, 120, 1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 100, 0.3)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 215, 100, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 100, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  聊天
                </button>
              </div>
            </div>
          )}

          {/* Introduce 面板 */}
          {showPanel === 'introduce' && (
            <div>
              <h2 style={{ 
                color: 'rgba(255, 220, 120, 1)', 
                fontSize: '24px', 
                marginBottom: '20px',
                textAlign: 'center',
              }}>
                角色介绍
              </h2>
              <div style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '16px', 
                lineHeight: '1.8',
                textAlign: 'left',
                padding: '20px',
                backgroundColor: 'rgba(255, 215, 100, 0.05)',
                borderRadius: '10px',
                marginBottom: '20px',
              }}>
                <p>
                  {selectedMascot === 'mascot-1' 
                    ? '这是第一个吉祥物的详细介绍。它是一个可爱、活泼的角色，代表着友谊和快乐。它喜欢与人们互动，总是带着灿烂的笑容。'
                    : selectedMascot === 'mascot-2'
                    ? '这是第二个吉祥物的详细介绍。它是一个聪明、勇敢的角色，象征着智慧和勇气。它善于解决问题，是团队中的智囊。'
                    : '这是第三个吉祥物的详细介绍。它是一个温柔、善良的角色，代表着关爱和包容。它总是关心他人，给人带来温暖。'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => handlePanelAction('name')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 215, 100, 0.2)',
                    border: '1px solid rgba(255, 215, 100, 0.5)',
                    color: 'rgba(255, 220, 120, 1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  返回
                </button>
                <button
                  onClick={() => handlePanelAction('chat')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 215, 100, 0.2)',
                    border: '1px solid rgba(255, 215, 100, 0.5)',
                    color: 'rgba(255, 220, 120, 1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  去聊天
                </button>
              </div>
            </div>
          )}

          {/* Chat 面板 */}
          {showPanel === 'chat' && (
            <div>
              <h2 style={{ 
                color: 'rgba(255, 220, 120, 1)', 
                fontSize: '24px', 
                marginBottom: '20px',
                textAlign: 'center',
              }}>
                与{selectedMascot}聊天
              </h2>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                padding: '15px', 
                backgroundColor: 'rgba(255, 215, 100, 0.05)',
                borderRadius: '10px',
                marginBottom: '15px',
              }}>
                {chatMessages.length === 0 ? (
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
                    开始聊天吧...
                  </p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: '10px',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: msg.isUser 
                          ? 'rgba(100, 180, 255, 0.2)' 
                          : 'rgba(255, 215, 100, 0.2)',
                        color: msg.isUser 
                          ? 'rgba(150, 210, 255, 1)' 
                          : 'rgba(255, 220, 120, 1)',
                        textAlign: msg.isUser ? 'right' : 'left',
                      }}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="输入消息..."
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'rgba(255, 215, 100, 0.1)',
                    border: '1px solid rgba(255, 215, 100, 0.3)',
                    borderRadius: '8px',
                    color: 'rgba(255, 255, 255, 1)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 215, 100, 0.3)',
                    border: '1px solid rgba(255, 215, 100, 0.5)',
                    color: 'rgba(255, 220, 120, 1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 100, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 215, 100, 0.3)';
                  }}
                >
                  发送
                </button>
              </form>
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button
                  onClick={() => handlePanelAction('name')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 215, 100, 0.3)',
                    color: 'rgba(255, 220, 120, 0.8)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  返回
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: '700px',
          height: '700px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        suppressHydrationWarning
      >
        <div className="ripple ripple-1" suppressHydrationWarning />
        <div className="ripple ripple-2" suppressHydrationWarning />
        <div className="ripple ripple-3" suppressHydrationWarning />
        <div className="ripple ripple-4" suppressHydrationWarning />
        <div className="ripple ripple-5" suppressHydrationWarning />
        <div className="ripple ripple-6" suppressHydrationWarning />

        <img
          src="/center-image.png"
          alt="中心图片"
          onClick={handleImageClick}
          suppressHydrationWarning
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'all 0.3s ease',
            boxShadow: isActivated
              ? '0 0 40px rgba(255, 215, 100, 0.8), 0 0 80px rgba(255, 200, 80, 0.5)'
              : '0 0 20px rgba(255, 215, 100, 0.4), 0 0 40px rgba(255, 200, 80, 0.2)',
            border: isActivated
              ? '3px solid rgba(255, 215, 100, 0.8)'
              : '2px solid rgba(255, 215, 100, 0.3)',
            transform: isActivated ? 'scale(1.05)' : 'scale(1)',
            filter: isActivated ? 'brightness(1.1)' : 'brightness(1)'
          }}
        />

        <div className="particle p1" suppressHydrationWarning />
        <div className="particle p2" suppressHydrationWarning />
        <div className="particle p3" suppressHydrationWarning />
        <div className="particle p4" suppressHydrationWarning />
        <div className="particle p5" suppressHydrationWarning />
        <div className="particle p6" suppressHydrationWarning />
        <div className="particle p7" suppressHydrationWarning />
        <div className="particle p8" suppressHydrationWarning />
        <div className="particle p9" suppressHydrationWarning />
        <div className="particle p10" suppressHydrationWarning />
        <div className="particle p11" suppressHydrationWarning />
        <div className="particle p12" suppressHydrationWarning />
        <div className="particle p13" suppressHydrationWarning />
        <div className="particle p14" suppressHydrationWarning />
        <div className="particle p15" suppressHydrationWarning />
        <div className="particle p16" suppressHydrationWarning />
        <div className="particle p17" suppressHydrationWarning />
        <div className="particle p18" suppressHydrationWarning />
        <div className="particle p19" suppressHydrationWarning />
        <div className="particle p20" suppressHydrationWarning />
      </div>

      <style jsx>{`
        .ripple {
          position: absolute;
          animation: ripple-expand 2.2s ease-out infinite;
          box-shadow:
            -8px -8px 30px rgba(255, 230, 140, 0.25),
            8px 8px 40px rgba(60, 40, 10, 0.5),
            inset 3px 3px 15px rgba(255, 250, 220, 0.1),
            inset -4px -4px 25px rgba(40, 30, 5, 0.35);
          pointer-events: none;
          z-index: 20;
        }

        .ripple::before {
          content: '';
          position: absolute;
          inset: 1px;
          background: linear-gradient(
            135deg,
            rgba(255, 240, 180, 0.15) 0%,
            rgba(255, 220, 140, 0.08) 35%,
            transparent 50%,
            rgba(50, 40, 10, 0.1) 75%,
            rgba(30, 25, 5, 0.18) 100%
          );
          filter: blur(2px);
        }

        .ripple::after {
          content: '';
          position: absolute;
          top: 6%;
          left: 8%;
          width: 35%;
          height: 18%;
          background: linear-gradient(
            180deg,
            rgba(255, 245, 200, 0.22) 0%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(6px);
        }

        .ripple-1 {
          width: 120px;
          height: 100px;
          animation-delay: 0s;
          border-radius: 48% 52% 45% 55% / 55% 45% 52% 48%;
          border: 2px solid rgba(255, 225, 130, 0.7);
          transform: rotate(-8deg);
        }

        .ripple-2 {
          width: 220px;
          height: 185px;
          animation-delay: 0.5s;
          border-radius: 55% 45% 58% 42% / 42% 58% 45% 55%;
          border: 2px solid rgba(255, 215, 110, 0.55);
          transform: rotate(12deg);
        }

        .ripple-3 {
          width: 340px;
          height: 295px;
          animation-delay: 1s;
          border-radius: 43% 57% 47% 53% / 54% 46% 56% 44%;
          border: 2px solid rgba(255, 205, 95, 0.42);
          transform: rotate(-15deg);
        }

        .ripple-4 {
          width: 460px;
          height: 400px;
          animation-delay: 1.5s;
          border-radius: 58% 42% 54% 46% / 46% 54% 43% 57%;
          border: 2px solid rgba(255, 195, 80, 0.32);
          transform: rotate(9deg);
        }

        .ripple-5 {
          width: 580px;
          height: 510px;
          animation-delay: 2s;
          border-radius: 46% 54% 41% 59% / 57% 43% 51% 49%;
          border: 2px solid rgba(255, 185, 65, 0.22);
          transform: rotate(-11deg);
        }

        .ripple-6 {
          width: 700px;
          height: 620px;
          animation-delay: 2.5s;
          border-radius: 53% 47% 56% 44% / 44% 56% 48% 52%;
          border: 1.5px solid rgba(255, 175, 50, 0.14);
          transform: rotate(7deg);
        }

        @keyframes ripple-expand {
          0% {
            transform: scale(0.2);
            opacity: 0;
            border-width: 3.5px;
            filter: blur(0.5px);
          }
          15% {
            opacity: 1;
            filter: blur(0px);
          }
          45% {
            opacity: 0.7;
          }
          75% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0;
            border-width: 0.5px;
            filter: blur(1.5px);
          }
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: float-up var(--dur) ease-in-out infinite var(--delay);
          pointer-events: none;
          z-index: 40;
        }

        .p1  { left: 40%; top: 36%; width: 6px; height: 6px; --dur: 3s; --delay: 0s;   --x: -60px; --y: -90px; }
        .p2  { left: 54%; top: 38%; width: 5px; height: 5px; --dur: 3.5s; --delay: 0.3s; --x: 45px;  --y: -110px; }
        .p3  { left: 46%; top: 50%; width: 8px; height: 8px; --dur: 2.8s; --delay: 0.7s; --x: -18px; --y: -120px; }
        .p4  { left: 32%; top: 44%; width: 4px; height: 4px; --dur: 4s;   --delay: 0.2s; --x: -95px; --y: -70px; }
        .p5  { left: 64%; top: 48%; width: 7px; height: 7px; --dur: 3.2s; --delay: 1s;   --x: 78px;  --y: -95px; }
        .p6  { left: 42%; top: 30%; width: 5px; height: 5px; --dur: 3.8s; --delay: 0.5s; --x: -35px; --y: -140px; }
        .p7  { left: 56%; top: 58%; width: 4px; height: 4px; --dur: 2.6s; --delay: 1.2s; --x: 52px;  --y: -60px; }
        .p8  { left: 28%; top: 50%; width: 7px; height: 7px; --dur: 4.2s; --delay: 0.8s; --x: -120px;--y: -78px; }
        .p9  { left: 70%; top: 36%; width: 5px; height: 5px; --dur: 3.4s; --delay: 0.4s; --x: 95px;  --y: -105px; }
        .p10 { left: 48%; top: 62%; width: 4px; height: 4px; --dur: 3s;   --delay: 1.5s; --x: 10px;  --y: -52px; }
        .p11 { left: 35%; top: 26%; width: 5px; height: 5px; --dur: 3.6s; --delay: 0.9s; --x: -70px; --y: -130px; }
        .p12 { left: 66%; top: 46%; width: 7px; height: 7px; --dur: 2.9s; --delay: 1.1s; --x: 86px;  --y: -88px; }
        .p13 { left: 24%; top: 42%; width: 4px; height: 4px; --dur: 4.1s; --delay: 0.6s; --x: -140px;--y: -66px; }
        .p14 { left: 74%; top: 52%; width: 5px; height: 5px; --dur: 3.3s; --delay: 1.3s; --x: 112px; --y: -72px; }
        .p15 { left: 44%; top: 22%; width: 7px; height: 7px; --dur: 2.7s; --delay: 0.1s; --x: -26px; --y: -155px; }
        .p16 { left: 52%; top: 68%; width: 4px; height: 4px; --dur: 3.9s; --delay: 1.6s; --x: 18px;  --y: -44px; }
        .p17 { left: 20%; top: 48%; width: 5px; height: 5px; --dur: 3.7s; --delay: 0.35s;--x: -165px;--y: -82px; }
        .p18 { left: 78%; top: 32%; width: 7px; height: 7px; --dur: 3.1s; --delay: 0.85s;--x: 135px; --y: -118px; }
        .p19 { left: 36%; top: 66%; width: 4px; height: 4px; --dur: 4.3s; --delay: 1.4s; --x: -52px; --y: -38px; }
        .p20 { left: 58%; top: 24%; width: 5px; height: 5px; --dur: 2.5s; --delay: 0.55s;--x: 35px;  --y: -142px; }

        @keyframes float-up {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
            background: radial-gradient(circle, rgba(255, 215, 100, 1), rgba(255, 180, 50, 0.8));
            box-shadow:
              0 0 10px rgba(255, 200, 80, 1),
              0 0 25px rgba(255, 180, 50, 0.6),
              0 0 45px rgba(255, 160, 40, 0.3);
          }
          20% {
            transform: translate(calc(var(--x) * 0.2), calc(var(--y) * 0.2)) scale(1);
            opacity: 1;
          }
          60% {
            opacity: 0.85;
            background: radial-gradient(circle, rgba(255, 230, 140, 1), rgba(255, 200, 80, 0.7));
            box-shadow:
              0 0 14px rgba(255, 210, 90, 0.9),
              0 0 32px rgba(255, 190, 60, 0.5),
              0 0 55px rgba(255, 170, 40, 0.2);
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(0.3);
            opacity: 0;
            background: radial-gradient(circle, rgba(255, 200, 80, 0.6), rgba(255, 170, 40, 0.2));
            box-shadow:
              0 0 5px rgba(255, 190, 70, 0.3),
              0 0 12px rgba(255, 170, 50, 0.15);
          }
        }

        .audio-bar {
          position: absolute;
          width: 6px;
          background: linear-gradient(
            180deg,
            rgba(255, 230, 140, 0.9) 0%,
            rgba(255, 215, 100, 0.7) 50%,
            rgba(255, 200, 80, 0.5) 100%
          );
          border-radius: 3px;
          box-shadow:
            0 0 8px rgba(255, 215, 100, 0.6),
            0 0 16px rgba(255, 200, 80, 0.4),
            inset 0 0 4px rgba(255, 240, 180, 0.3);
          animation: audio-wave 1.2s ease-in-out infinite;
          pointer-events: none;
          z-index: 30;
          transform-origin: center center;
        }

        .bar-1 {
          height: 45px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg) translateY(-320px);
          animation-delay: 0s;
          --rot: 0deg;
        }

        .bar-2 {
          height: 55px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(18deg) translateY(-320px);
          animation-delay: 0.05s;
          --rot: 18deg;
        }

        .bar-3 {
          height: 40px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(36deg) translateY(-320px);
          animation-delay: 0.1s;
          --rot: 36deg;
        }

        .bar-4 {
          height: 70px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(54deg) translateY(-320px);
          animation-delay: 0.15s;
          --rot: 54deg;
        }

        .bar-5 {
          height: 50px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(72deg) translateY(-320px);
          animation-delay: 0.2s;
          --rot: 72deg;
        }

        .bar-6 {
          height: 60px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg) translateY(-320px);
          animation-delay: 0.25s;
          --rot: 90deg;
        }

        .bar-7 {
          height: 45px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(108deg) translateY(-320px);
          animation-delay: 0.3s;
          --rot: 108deg;
        }

        .bar-8 {
          height: 65px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(126deg) translateY(-320px);
          animation-delay: 0.35s;
          --rot: 126deg;
        }

        .bar-9 {
          height: 50px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(144deg) translateY(-320px);
          animation-delay: 0.4s;
          --rot: 144deg;
        }

        .bar-10 {
          height: 55px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(162deg) translateY(-320px);
          animation-delay: 0.45s;
          --rot: 162deg;
        }

        .bar-11 {
          height: 48px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(180deg) translateY(-320px);
          animation-delay: 0.5s;
          --rot: 180deg;
        }

        .bar-12 {
          height: 58px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(198deg) translateY(-320px);
          animation-delay: 0.55s;
          --rot: 198deg;
        }

        .bar-13 {
          height: 42px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(216deg) translateY(-320px);
          animation-delay: 0.6s;
          --rot: 216deg;
        }

        .bar-14 {
          height: 68px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(234deg) translateY(-320px);
          animation-delay: 0.65s;
          --rot: 234deg;
        }

        .bar-15 {
          height: 52px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(252deg) translateY(-320px);
          animation-delay: 0.7s;
          --rot: 252deg;
        }

        .bar-16 {
          height: 62px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(270deg) translateY(-320px);
          animation-delay: 0.75s;
          --rot: 270deg;
        }

        .bar-17 {
          height: 46px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(288deg) translateY(-320px);
          animation-delay: 0.8s;
          --rot: 288deg;
        }

        .bar-18 {
          height: 64px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(306deg) translateY(-320px);
          animation-delay: 0.85s;
          --rot: 306deg;
        }

        .bar-19 {
          height: 54px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(324deg) translateY(-320px);
          animation-delay: 0.9s;
          --rot: 324deg;
        }

        .bar-20 {
          height: 56px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(342deg) translateY(-320px);
          animation-delay: 0.95s;
          --rot: 342deg;
        }

        @keyframes audio-wave {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-320px) scaleY(0.3);
            opacity: 0.4;
            filter: blur(0.5px);
          }
          50% {
            transform: translate(-50%, -50%) rotate(var(--rot)) translateY(-320px) scaleY(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes satellite-appear {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes satellite-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 20px rgba(255, 215, 100, 0.8), 0 0 40px rgba(255, 180, 50, 0.5), inset 0 0 15px rgba(255, 240, 180, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: 0 0 30px rgba(255, 215, 100, 1), 0 0 60px rgba(255, 180, 50, 0.7), inset 0 0 20px rgba(255, 240, 180, 0.5);
          }
        }

        @keyframes sub-satellite-appear {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes satellite-disappear {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
        }

        .satellite-ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(255, 225, 130, 0.7);
          box-shadow:
            -8px -8px 30px rgba(255, 230, 140, 0.25),
            8px 8px 40px rgba(60, 40, 10, 0.5),
            inset 3px 3px 15px rgba(255, 250, 220, 0.1),
            inset -4px -4px 25px rgba(40, 30, 5, 0.35);
          animation: ripple-expand 2.2s ease-out infinite;
          pointer-events: none;
        }

        .satellite-ripple::before {
          content: '';
          position: absolute;
          inset: 1px;
          background: linear-gradient(
            135deg,
            rgba(255, 240, 180, 0.15) 0%,
            rgba(255, 220, 140, 0.08) 35%,
            transparent 50%,
            rgba(50, 40, 10, 0.1) 75%,
            rgba(30, 25, 5, 0.18) 100%
          );
          filter: blur(2px);
        }

        .satellite-ripple::after {
          content: '';
          position: absolute;
          top: 6%;
          left: 8%;
          width: 35%;
          height: 18%;
          background: linear-gradient(
            180deg,
            rgba(255, 245, 200, 0.22) 0%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(6px);
        }

        .satellite-bar {
          position: absolute;
          width: 3px;
          background: linear-gradient(
            180deg,
            rgba(255, 230, 140, 0.9) 0%,
            rgba(255, 215, 100, 0.7) 50%,
            rgba(255, 200, 80, 0.5) 100%
          );
          border-radius: 2px;
          box-shadow:
            0 0 4px rgba(255, 215, 100, 0.6),
            0 0 8px rgba(255, 200, 80, 0.4);
          animation: satellite-audio-wave 1.2s ease-in-out infinite;
          pointer-events: none;
          z-index: 30;
          transform-origin: center center;
        }

        .satellite-bar.bar-1 {
          height: 20px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg) translateY(-40px);
          animation-delay: 0s;
        }

        .satellite-bar.bar-2 {
          height: 22px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg) translateY(-40px);
          animation-delay: 0.1s;
        }

        .satellite-bar.bar-3 {
          height: 18px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg) translateY(-40px);
          animation-delay: 0.2s;
        }

        .satellite-bar.bar-4 {
          height: 24px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(135deg) translateY(-40px);
          animation-delay: 0.3s;
        }

        .satellite-bar.bar-5 {
          height: 20px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(180deg) translateY(-40px);
          animation-delay: 0.4s;
        }

        .satellite-bar.bar-6 {
          height: 23px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(225deg) translateY(-40px);
          animation-delay: 0.5s;
        }

        .satellite-bar.bar-7 {
          height: 19px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(270deg) translateY(-40px);
          animation-delay: 0.6s;
        }

        .satellite-bar.bar-8 {
          height: 21px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(315deg) translateY(-40px);
          animation-delay: 0.7s;
        }

        .satellite-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 240, 180, 1) 0%,
            rgba(255, 220, 120, 0.8) 40%,
            rgba(255, 200, 80, 0.4) 70%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(255, 220, 120, 1), 0 0 20px rgba(255, 200, 80, 0.6), 0 0 30px rgba(255, 180, 40, 0.3);
          animation: satellite-float-up var(--dur) ease-in-out infinite var(--delay);
          pointer-events: none;
          z-index: 40;
        }

        .satellite-particle.p1 {
          width: 5px;
          height: 5px;
          top: 50%;
          left: 50%;
          --dur: 2.2s;
          --delay: 0s;
          --x: -50px;
          --y: -30px;
        }

        .satellite-particle.p2 {
          width: 4px;
          height: 4px;
          top: 50%;
          left: 50%;
          --dur: 2.8s;
          --delay: 0.3s;
          --x: 45px;
          --y: -40px;
        }

        .satellite-particle.p3 {
          width: 6px;
          height: 6px;
          top: 50%;
          left: 50%;
          --dur: 2.5s;
          --delay: 0.6s;
          --x: -20px;
          --y: -60px;
        }

        .satellite-particle.p4 {
          width: 5px;
          height: 5px;
          top: 50%;
          left: 50%;
          --dur: 3s;
          --delay: 0.9s;
          --x: 55px;
          --y: -20px;
        }

        .satellite-particle.p5 {
          width: 4px;
          height: 4px;
          top: 50%;
          left: 50%;
          --dur: 2.6s;
          --delay: 1.2s;
          --x: -35px;
          --y: -50px;
        }

        .satellite-particle.p6 {
          width: 4px;
          height: 4px;
          top: 50%;
          left: 50%;
          --dur: 2.4s;
          --delay: 0.15s;
          --x: 30px;
          --y: 55px;
        }

        .satellite-particle.p7 {
          width: 5px;
          height: 5px;
          top: 50%;
          left: 50%;
          --dur: 2.9s;
          --delay: 0.45s;
          --x: -45px;
          --y: 40px;
        }

        .satellite-particle.p8 {
          width: 6px;
          height: 6px;
          top: 50%;
          left: 50%;
          --dur: 2.3s;
          --delay: 0.75s;
          --x: 60px;
          --y: 10px;
        }

        .satellite-particle.p9 {
          width: 4px;
          height: 4px;
          top: 50%;
          left: 50%;
          --dur: 2.7s;
          --delay: 1.05s;
          --x: -60px;
          --y: 25px;
        }

        .satellite-particle.p10 {
          width: 5px;
          height: 5px;
          top: 50%;
          left: 50%;
          --dur: 3.1s;
          --delay: 1.35s;
          --x: 15px;
          --y: 65px;
        }

        @keyframes satellite-audio-wave {
          0%, 100% {
            transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-40px) scaleY(0.3);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-40px) scaleY(1.5);
            opacity: 1;
          }
        }

        @keyframes satellite-float-up {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1);
            opacity: 0;
          }
        }

        @keyframes center-particle-glow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
            box-shadow: 0 0 12px rgba(255,220,120,1), 0 0 24px rgba(255,200,80,0.6);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 1;
            box-shadow: 0 0 18px rgba(255,220,120,1), 0 0 36px rgba(255,200,80,0.8);
          }
        }

        .center-particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(150,210,255,1), rgba(100,180,240,0.8));
          box-shadow: 0 0 8px rgba(100,180,255,1), 0 0 16px rgba(80,160,240,0.6);
          animation: center-particle-spread 1.5s ease-out infinite;
          pointer-events: none;
          z-index: 100;
        }

        .cp1 { --angle: 0deg; --dist: 25px; animation-delay: 0s; }
        .cp2 { --angle: 45deg; --dist: 28px; animation-delay: 0.15s; }
        .cp3 { --angle: 90deg; --dist: 25px; animation-delay: 0.3s; }
        .cp4 { --angle: 135deg; --dist: 28px; animation-delay: 0.45s; }
        .cp5 { --angle: 180deg; --dist: 25px; animation-delay: 0.6s; }
        .cp6 { --angle: 225deg; --dist: 28px; animation-delay: 0.75s; }
        .cp7 { --angle: 270deg; --dist: 25px; animation-delay: 0.9s; }
        .cp8 { --angle: 315deg; --dist: 28px; animation-delay: 1.05s; }

        @keyframes center-particle-spread {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateX(var(--tx)) translateY(var(--ty)) scale(0.3);
            opacity: 0;
          }
        }

        .cp1 { --tx: 0px; --ty: -25px; animation-delay: 0s; }
        .cp2 { --tx: 20px; --ty: -20px; animation-delay: 0.15s; }
        .cp3 { --tx: 25px; --ty: 0px; animation-delay: 0.3s; }
        .cp4 { --tx: 20px; --ty: 20px; animation-delay: 0.45s; }
        .cp5 { --tx: 0px; --ty: 25px; animation-delay: 0.6s; }
        .cp6 { --tx: -20px; --ty: 20px; animation-delay: 0.75s; }
        .cp7 { --tx: -25px; --ty: 0px; animation-delay: 0.9s; }
        .cp8 { --tx: -20px; --ty: -20px; animation-delay: 1.05s; }

        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes wave-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        @keyframes satellite-wave {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: scale(3.5) rotate(0deg);
            opacity: 0;
          }
        }

        .satellite {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,223,112,1), rgba(255,185,64,1));
          border: 2px solid rgba(255,230,160,0.9);
          box-shadow: 0 0 18px rgba(255,190,70,0.7), 0 0 32px rgba(255,170,50,0.4);
          transform: translate(-50%, -50%) scale(0);
        }

        .satellite-1 {
          top: calc(50% - 150px);
          left: calc(50% + 280px);
          animation: satellite-appear 0.8s ease-out forwards 0.2s, wave-pulse 3s ease-in-out infinite 1s;
        }

        .satellite-2 {
          top: calc(50% - 150px);
          left: calc(50% - 280px);
          animation: satellite-appear 0.8s ease-out forwards 0.1s, wave-pulse 3s ease-in-out infinite 0.5s;
        }

        .satellite-3 {
          top: calc(50% + 250px);
          left: calc(50% - 200px);
          animation: satellite-appear 0.8s ease-out forwards 0.3s, wave-pulse 3s ease-in-out infinite 1.5s;
        }

        .satellite-4 {
          top: calc(50% + 220px);
          left: calc(50% + 230px);
          animation: satellite-appear 0.8s ease-out forwards 0.4s, wave-pulse 3s ease-in-out infinite 2s;
        }

        .satellite-wave {
          position: absolute;
          inset: -4;
          border: 2px solid rgba(255,220,130,0.4);
          animation: satellite-wave 2.8s ease-out infinite;
          pointer-events: none;
        }

        .wave-1-1 {
          border-radius: 48% 52% 45% 55% / 55% 45% 52% 48%;
          transform: rotate(-8deg);
          --rot: -8deg;
        }

        .wave-1-2 {
          border-radius: 55% 45% 58% 42% / 42% 58% 45% 55%;
          transform: rotate(12deg);
          --rot: 12deg;
          animation-delay: 0.5s;
        }

        .wave-1-3 {
          border-radius: 43% 57% 47% 53% / 54% 46% 56% 44%;
          transform: rotate(-15deg);
          --rot: -15deg;
          animation-delay: 1s;
        }

        .wave-2-1 {
          border-radius: 58% 42% 54% 46% / 46% 54% 43% 57%;
          transform: rotate(9deg);
          --rot: 9deg;
        }

        .wave-2-2 {
          border-radius: 46% 54% 41% 59% / 57% 43% 51% 49%;
          transform: rotate(-11deg);
          --rot: -11deg;
          animation-delay: 0.5s;
        }

        .wave-2-3 {
          border-radius: 53% 47% 56% 44% / 44% 56% 48% 52%;
          transform: rotate(7deg);
          --rot: 7deg;
          animation-delay: 1s;
        }

        .wave-3-1 {
          border-radius: 45% 55% 52% 48% / 48% 52% 45% 55%;
          transform: rotate(10deg);
          --rot: 10deg;
        }

        .wave-3-2 {
          border-radius: 52% 48% 46% 54% / 51% 49% 57% 43%;
          transform: rotate(-13deg);
          --rot: -13deg;
          animation-delay: 0.5s;
        }

        .wave-3-3 {
          border-radius: 49% 51% 55% 45% / 46% 54% 49% 51%;
          transform: rotate(8deg);
          --rot: 8deg;
          animation-delay: 1s;
        }

        .wave-4-1 {
          border-radius: 51% 49% 48% 52% / 53% 47% 54% 46%;
          transform: rotate(-10deg);
          --rot: -10deg;
        }

        .wave-4-2 {
          border-radius: 47% 53% 57% 43% / 49% 51% 46% 54%;
          transform: rotate(14deg);
          --rot: 14deg;
          animation-delay: 0.5s;
        }

        .wave-4-3 {
          border-radius: 54% 46% 45% 55% / 50% 50% 58% 42%;
          transform: rotate(-6deg);
          --rot: -6deg;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
