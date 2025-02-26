import React from 'react'
import Navbar from './Navbar'
import { useRouter } from 'next/navigation';

const Header = () => {
      const router = useRouter();
      
  return (
    <header className='sticky top-0 bg-primary z-50'>
        <div className='flex justify-between items-center p-4 text-black'>
            <div>
                <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        🌟      Prezagia
                </h1>
            </div>
            <div>
                <Navbar />
            </div>
        </div>
    </header>

  )
}

export default Header