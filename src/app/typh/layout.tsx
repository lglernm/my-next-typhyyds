"use client"
import {useState} from "react";
import Link from "next/link";
const bgStyle: React.CSSProperties = {
  backgroundImage: 'url("/typh-bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  minWidth: '100vw',
};
export default function TyphfanLayout({ children }: { children: React.ReactNode } )
{
    const [count, setCount] = useState(0);
  return (
    <div style={bgStyle}>
        <h1>TYPH FAN CREATE</h1>
     


     {children}
     
      <Link 
  style={{ color: '#3b82f6', display: 'block' }} 
  href="/typh/typh_introduce"
>
  typh_introduce
</Link>

<Link 
  style={{ color: '#3b82f6', display: 'block' }} 
  href="/typh/typh_role"
>
  typh_role
</Link>
    </div>
  );
}