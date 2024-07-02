import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const reqBody = await request.json();
        const { username, finalMoney } = reqBody;

        // Validate input
        if (!username || finalMoney === undefined) {
            return NextResponse.json(
                { message: 'Invalid input', success: false },
                { status: 400 }
            );
        }

        // Find the user and update the final money value
        const user = await User.findOneAndUpdate(
            { username },
            { $set: { 'finalMoney': finalMoney } }, // Adjust field path if necessary
            { new: true } // Return the updated document
        ).exec();

        if (!user) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Final money value updated successfully', success: true },
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
