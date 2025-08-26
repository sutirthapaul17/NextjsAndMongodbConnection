// import connectToDatabase from "../../../lib/mongoose";
// import User from "../../../models/user";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     try{
//         await connectToDatabase();
//         const {name,email} = await request.json();
//         const newUser = new User({name,email});
//         await newUser.save();
//         return NextResponse.json({message: "User created successfully"}, newUser, {status: 201});

//     }catch(err){
//         console.log(err);
//     }
// }



import connectToDatabase from "../../../lib/mongoose"; // Make sure this matches your actual file
import User from "../../../models/user"; // Make sure the path and capitalization are correct
import { NextResponse } from 'next/server';

// GET all users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ 
      success: true, 
      data: users 
    }, { status: 200 });
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 400 });
  }
}

// CREATE a new user
export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, email } = await request.json();
    
    // Create and save new user
    const newUser = new User({ name, email });
    await newUser.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "User created successfully",
      data: newUser 
    }, { status: 201 });

  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 400 });
  }
}
