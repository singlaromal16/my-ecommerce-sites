import { NextRequest } from "next/server";
import { connectToDatabase } from "../../db";

type Params = {
    id: string
}

export async function GET(request: NextRequest, { params }: { params: Params }) {

    const { db } = await connectToDatabase();
    const product = await db.collection('products').findOne({id: params.id});

    if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}