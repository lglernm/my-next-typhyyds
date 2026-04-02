"use client"
import {useState} from "react";
import Link from "next/link";   
export default function TyphfanLayout({ children }: { children: React.ReactNode } )
{
    const [count, setCount] = useState(0);
  return (
    <div>
        <h1>TYPH FAN CREATE</h1>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <p>count: {count}</p>

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