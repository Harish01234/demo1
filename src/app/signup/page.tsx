"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ModeToggle } from '@/components/modeToggle';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import axios from 'axios';

function Page() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });

    const signuphandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent the default form submission
        console.log(user);

        try {
            await axios.post('/api/signup', user);
            router.push("/signin");
        } catch (error) {
            console.error("Error signing up:", error);
            // Handle the error, e.g., display a message to the user
        }
    };

    return (
        <div>
            <div className='absolute top-0 right-0'>
                <ModeToggle />
            </div>
            <div className='grid gap-4 m-9 sm:grid-cols-2 grid-cols-1'>
                <div>
                    <h1 className='text-4xl text-gray-400'>Hisab Kitab</h1>
                    <h2 className='text-gray-400 mt-9'>
                        Hisab Kitab helps you keep track of money you&apos;ve lent and borrowed, including interest.
                        You can also log extra transactions with notes. It automatically calculates your net balance
                        and keeps all your financial records organized and easy to access.
                    </h2>
                </div>
                <form onSubmit={signuphandler} className='grid gap-4 m-9'>
                    <h2>Signup and start your journey</h2>
                    <Input
                        type='text'
                        placeholder='Username'
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                    <Input
                        type='email'
                        placeholder='Email'
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <Input
                        type='password'
                        placeholder='Password'
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <Button type='submit'>Signup</Button>
                </form>
            </div>
        </div>
    );
}

export default Page;
