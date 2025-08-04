"use client";
import { useState } from "react"
import { Product } from "../product-data";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // This will ensure the page is always revalidated on each request 

export default function ShoppingCartList({initialCardProducts} : {initialCardProducts: Product[]}) {
  const [cardProducts, setCartProducts] = useState(initialCardProducts);

    async function removeFromCart(productId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/1/cart`,
      {
        method: "DELETE",
        body: JSON.stringify({ productId }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const updatedCart = await response.json();
    setCartProducts(updatedCart);
  }

//   const cardProducts = cardId.map(id => (products.find((product) => product.id === id)! ));
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <ul className="space-y-4">
      {cardProducts.map((product) => (
        <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300" key={product.id}>
        <Link href={'/products/'+product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600">Price: ${product.price}</p>
         <div className="flex justify-end">
          <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => {
            e.preventDefault();
            removeFromCart(product.id)
          }}>Remove from Cart</button></div>
        </Link>
        </li>
      ))}
      </ul>
      <Link href={'/checkout'}>Checkout</Link>
    </div>
  )

}   