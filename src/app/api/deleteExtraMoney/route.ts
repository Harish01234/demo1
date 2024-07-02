import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, note } = reqBody;

        // Validate input
        if (!username || typeof note !== 'string') {
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

        // Find the index of the extra money entry to remove
        const index = user.extraMoney.findIndex((entry: { note: string; }) => entry.note === note);
        if (index === -1) {
            return NextResponse.json(
                { message: 'Extra money entry not found', success: false },
                { status: 404 }
            );
        }

        // Remove the extra money entry
        user.extraMoney.splice(index, 1);
        await user.save();

        return NextResponse.json(
            { message: 'Extra money entry deleted successfully', success: true },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error deleting extra money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
