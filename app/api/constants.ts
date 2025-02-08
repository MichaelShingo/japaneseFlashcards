import { NextResponse } from "next/server";

const badRequest = (errorMessage: string): NextResponse => {
    return NextResponse.json({ message: errorMessage }, { status: 400 });
};

export const responses = {
    notAuthenticated: () => NextResponse.json({ message: 'Not authenticated' }, { status: 401 }),
    badRequest,
};