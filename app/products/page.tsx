// import { products } from "../product-data";
import ProductsList from "../ProductsList";

// export const dynamic = 'force-dynamic'; // This will ensure the page is always revalidated on each request  

export default async function ProductsPage() {
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`); 
  const products = await response.json(); 

   const response2 = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/1/cart` , {cache: 'no-cache'});
   const cartProducts = await response2.json();

  return (
    <div className="container mx-auto p-8">
     <h1 className="text-3xl font-bold mb-8"> Products </h1>
      <ProductsList products={products} initialCardProducts = {cartProducts}/> 
     </div>
)
}