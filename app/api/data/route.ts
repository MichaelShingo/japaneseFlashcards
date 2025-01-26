export async function GET(request: Request) {
    return Response.json({ myData: 'test route' });
}