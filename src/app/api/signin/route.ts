import connectDb from '@/lib/connectDb';
import { User } from '@/model/model';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        // Validation
        console.log(reqBody);
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }
        console.log("User exists");

        // Password comparison
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Check your credentials" }, { status: 400 });
        }

        // Generate JWT token
        const tokenData = {
            userId: user._id,
            username: user.username
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        // Create response with token set in httpOnly cookie
        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag for production
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/'
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
