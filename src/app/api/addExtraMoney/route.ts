import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, money, note } = reqBody;

        // Validate input
        if (!username || typeof money !== 'number' || typeof note !== 'string') {
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

        // Create a new extra money entry and add it to the user's extraMoney array
        const newExtraMoney = { money, note };
        user.extraMoney.push(newExtraMoney);
        await user.save();

        return NextResponse.json(
            { message: 'Extra money added successfully', success: true },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error adding extra money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
