import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connectDb();

export async function PATCH(request: NextRequest) {
    try {
        // Parse the request body
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

        // Calculate the total values
       
       
        const totalTakenMoney = user.takenMoney.reduce((sum: any, entry: { money: any; interest: any; }) => sum + (entry.money || 0) + (entry.interest || 0), 0);
        const totalGivenMoney = user.givenMoney.reduce((sum: any, entry: { money: any; }) => sum + (entry.money || 0), 0);
        const totalExtraMoney = user.extraMoney.reduce((sum: any, entry: { money: any; }) => sum + (entry.money || 0), 0);

        console.log(totalTakenMoney);
        console.log(totalGivenMoney);
        console.log(totalExtraMoney);
        
        
        
        // Calculate the final money
        const finalMoney = totalTakenMoney - totalGivenMoney - totalExtraMoney;

        // Update the user's finalMoney
        user.finalMoney = (user.finalMoney || 0) + finalMoney;
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
