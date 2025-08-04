"use client";

import Image from "next/image";
import { Product } from "./product-data";
import Link from "next/link";
import { useState } from "react";

export const dynamic = 'force-dynamic'; // This will ensure the page is always revalidated on each request 

export default function ProductsList({ products, initialCardProducts = [] }: { products: Product[], initialCardProducts: Product[] }) {
  const [cartProducts, setCartProducts] = useState(initialCardProducts);

  async function addToCart(productId: string) {
    const response = await
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/1/cart`,
        {
          method: "POST",
          body: JSON.stringify({ productId }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

    const updatedCart = await response.json();
    setCartProducts(updatedCart);
  }

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


  function productIsInCart(productId: string) {
    return cartProducts.some(product => product.id === productId);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
          <div className="flex justify-center mb-4 h-48 relative"> {/* Added height and relative positioning */}
            <Image src={'/' + product.imageUrl} alt={product.name} fill // Fill the container
              className="object-cover rounded-md" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600">Price: ${product.price}</p>

          {productIsInCart(product.id) ? (<button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={(e) => {
            e.preventDefault();
            removeFromCart(product.id)
          }}>Remove from Cart</button>) :
            (<button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={(e) => {
              e.preventDefault();
              addToCart(product.id)
            }}
            >Add to Cart</button>)
          }
        </Link>
      ))}
    </div>
  );
}