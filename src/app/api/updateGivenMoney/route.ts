import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function PATCH(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, no, newNo, newMoney } = reqBody;

        // Validate input
        if (!username || typeof no !== 'number' || typeof newNo !== 'number' || typeof newMoney !== 'number') {
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

        // Find the index of the given money entry to update
        const index = user.givenMoney.findIndex((entry: { no: number; }) => entry.no === no);
        if (index === -1) {
            return NextResponse.json(
                { message: 'Given money entry not found', success: false },
                { status: 404 }
            );
        }

        // Update the given money entry
        user.givenMoney[index] = { no: newNo, money: newMoney };
        await user.save();

        return NextResponse.json(
            { message: 'Given money entry updated successfully', success: true },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error updating given money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
