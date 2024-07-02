import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, amount } = reqBody;

        // Validate input
        if (!username || typeof amount !== 'number') {
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

        // Update the finalMoney
        user.finalMoney += amount;
        await user.save();

        return NextResponse.json(
            { message: 'Final money updated successfully', success: true },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating final money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
