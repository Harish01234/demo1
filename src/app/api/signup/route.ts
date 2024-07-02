import connectDb from '@/lib/connectDb';
import { User } from '@/model/model';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, givenMoney, takenMoney, extraMoney, finalMoney } = reqBody;

        // Validation
        console.log(reqBody);
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            finalMoney: finalMoney !== undefined ? finalMoney : 0, // Ensure finalMoney is set
            givenMoney: givenMoney || [],
            takenMoney: takenMoney || [],
            extraMoney: extraMoney || []
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        // Send verification mail (if applicable)

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
