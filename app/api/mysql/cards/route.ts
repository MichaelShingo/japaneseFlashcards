
import { NextResponse, NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import { GetDBSettings, IDBSettings } from '@/utils/common';
import { createConnection } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const db = await createConnection();
        const sql = "SELECT * FROM cards";
        const [results] = await db.query(sql);

        return NextResponse.json(results);
    } catch (err) {
        return NextResponse.json({ response: 'ehllo' }, { status: 200 });
    }
}