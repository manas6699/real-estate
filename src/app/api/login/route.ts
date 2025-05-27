import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, body);
    const { token } = res.data;

    console.log('token from route api : ' , token);

    // Create the response manually
    const response = new NextResponse(
      JSON.stringify({ message: 'Login successful' }), // body
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ✅ this works in dev
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });      

    return response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { message: err.response?.data?.message || 'Login failed' },
      { status: 401 }
    );
  }
}
