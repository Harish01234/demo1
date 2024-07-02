import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username } = reqBody;

        // Validate input
        if (!username) {
            return NextResponse.json(
                { message: 'Username is required', success: false },
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

        // Reset the user's finalMoney and clear arrays
        user.finalMoney = 0;
        user.givenMoney = [];
        user.takenMoney = [];
        user.extraMoney = [];
        await user.save();

        return NextResponse.json(
            { message: 'User data reset successfully', success: true },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error resetting user data:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
