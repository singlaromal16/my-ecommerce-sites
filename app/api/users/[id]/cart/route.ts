import { NextRequest } from "next/server";
import { connectToDatabase } from "@/app/api/db";
import { products } from "@/app/product-data";

type ShoppingCart = Record<string, string[]>;

// const carts: ShoppingCart = {
//     '1': ['123', '345'],
//     '2': ['234', '456'],
// }

type Params = {
    id: string
}

type CartBody = {
    productId: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    const { db } = await connectToDatabase();
    const userId = params.id;
    const userCart = await db.collection('carts').findOne({ userId })

    // If no products in cart for the user, return an empty array
    if (!userCart) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const cartIds = userCart.cartIds;
    console.log("Cart IDs:", cartIds);
    const cartProducts = await db.collection('products').find({ id: { $in: cartIds } }).toArray();

    if (!cartProducts) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
    const { db } = await connectToDatabase();
    const userId = params.id;
    const body: CartBody = await request.json();
    const productId = body.productId;

    const updatedCart = await db.collection('carts').findOneAndUpdate(
        { userId },
        { $push: { cartIds: productId } },
        { upsert: true, returnDocument: 'after' }
    )

    console.log("Updated Cart:", updatedCart);

    const cartProducts = await db.collection('products').find({ id: { $in: updatedCart.cartIds } }).toArray();

    return new Response(JSON.stringify(cartProducts), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    const { db } = await connectToDatabase();
    const userId = params.id;
    const body: CartBody = await request.json();
    const productId = body.productId;

    // // Check if the product exists in the user's cart
    // if (!carts[userId] || !carts[userId].includes(productId)) {
    //     return new Response(JSON.stringify({ error: "Product not found in cart" }), {
    //         status: 404,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    // }

    // Remove the product from the user's cart
    // carts[userId] = carts[userId] ? carts[userId].filter(id => id !== productId) : [];
    const updatedCart = await db.collection('carts').findOneAndUpdate({ userId },
        { $pull: { cartIds: productId } },
        { returnDocument: 'after' }
    )

    if (!updatedCart) {
        return new Response(JSON.stringify([]), {
            status: 202,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const cartProducts = await db.collection('products').find({ id: { $in: updatedCart.cartIds } }).toArray();

    return new Response(JSON.stringify(cartProducts), {
        status: 202,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
