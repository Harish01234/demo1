import connectDb from '@/lib/connectDb';
import { User } from '@/model/model'; // Adjust the import path if necessary
import { NextRequest, NextResponse } from 'next/server';


// Connect to the database
connectDb();

export async function  POST(request: NextRequest) {

    try {

        const reqBody = await request.json();
        const { username } = reqBody;

        if (!username) {
            return NextResponse.json(
                { message: 'Invalid input IN IF', success: false },
                { status: 400 }
            );

        }

        const user = await User.findOne({ username }).exec();
        if (!user) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        const data= await user.finalMoney
        console.log(data);
        
        
        return NextResponse.json(
            { message: 'Given money entry updated successfully',final:data, success: true },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error getting final money:', error.message);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }


}