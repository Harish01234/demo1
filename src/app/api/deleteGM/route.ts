import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, no } = reqBody;

        // Validate input
        if (!username || typeof no !== 'number') {
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

        // Find the index of the given money entry to remove
        const index = user.givenMoney.findIndex((entry: { no: number; }) => entry.no === no);
        if (index === -1) {
            return NextResponse.json(
                { message: 'Given money entry not found', success: false },
                { status: 404 }
            );
        }

        // Remove the given money entry
        user.givenMoney.splice(index, 1);
        await user.save();

        return NextResponse.json(
            { message: 'Given money entry deleted successfully', success: true },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error deleting given money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
