"use client"
import {useState} from "react";
import Link from "next/link";
export default function TyphfanLayout({ children }: { children: React.ReactNode } )
{
    const [count, setCount] = useState(0);
    const bgStyle: React.CSSProperties = {
      backgroundColor: 'transparent',
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    };
    const bgImageStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60%',
      height: 'auto',
      zIndex: 0,
      pointerEvents: 'none',
    };
    const contentStyle: React.CSSProperties = {
      backgroundColor: 'transparent',
      padding: '20px 40px',
      borderRadius: '12px',
      marginTop: '20px',
      textAlign: 'center',
      zIndex: 1,
    };
  return (
    <div style={bgStyle}>
        <img 
          src="/typh-new-bg.png" 
          alt="Typh" 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: 'auto',
            maxWidth: '80%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <h1 style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '12px 40px', borderRadius: '12px', marginTop: '20px', zIndex: 1 }}>TYPH FAN CREATE</h1>
     <div style={contentStyle}>
     {children}
    </div>
    </div>
  );
}