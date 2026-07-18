import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Route } from 'lucide-react';

export async function GET() {
    try {
        const conn = await connectDB();
        return NextResponse.json({
            status: 'ok',
            message: 'MongoDB connected',
            db: conn.connection.name,
            host: conn.connection.host,
        });
    } catch (err) {
        return NextResponse.json(
            { status: 'error', message: (err as Error).message },
            { status: 500 }
        );
    }
}