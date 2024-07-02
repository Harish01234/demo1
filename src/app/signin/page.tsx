"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { ModeToggle } from '@/components/modeToggle'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import axios from 'axios'

function Page() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const signinhandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signin', user);
      console.log(response);
      console.log(user);
      router.push(`/profile/${user.username}`);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className='absolute top-0 right-0'><ModeToggle /></div>
      <div className='grid gap-4 m-9 sm:grid-cols-2 grid-cols-1'>
        <div>
          <h1 className='text-4xl text-gray-400'>Hisab Kitab</h1>
          <h2 className='text-gray-400 mt-9'>
            Hisab Kitab helps you keep track of money you&apos;ve lent and borrowed, including interest. 
            You can also log extra transactions with notes. It automatically calculates your net balance 
            and keeps all your financial records organized and easy to access.
          </h2>
        </div>
        <form onSubmit={signinhandler} className='grid gap-4 m-9'>
          <Input type='text' placeholder='Username' name='Username' onChange={(e) => setUser({ ...user, username: e.target.value })} />
          <Input type='password' placeholder='Password' name='Password' onChange={(e) => setUser({ ...user, password: e.target.value })} />
          <Button type='submit'>Sign In</Button>
          <Link href='/signup' className='text-green-400'>Create new account</Link>
        </form>
      </div>
    </div>
  )
}

export default Page
