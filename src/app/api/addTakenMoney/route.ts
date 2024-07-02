import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, no, money, interest } = reqBody;

        // Validate input
        if (!username || typeof no !== 'number' || typeof money !== 'number' || typeof interest !== 'number') {
            return NextResponse.json(
                { message: 'Invalid input', success: false },
                { status: 400 }
            );
        }

        // Find the user by username
        const user = await User.findOne({ username }).exec();
        if (!user) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        // Create a new taken money entry and add it to the user's takenMoney array
        const newTakenMoney = { no, money, interest };
        user.takenMoney.push(newTakenMoney);
        await user.save();

        return NextResponse.json(
            { message: 'Taken money added successfully', success: true },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error adding taken money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
