import ShoppingCartList from "./ShoppingCartList";

export const dynamic = 'force-dynamic'; // This will ensure the page is always revalidated on each request 

export default async function CartPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/1/cart`, {cache: 'no-cache'});
    console.log("Response from Cart API:", response);
    const cartProducts = await response.json()

    return (
        <ShoppingCartList initialCardProducts={cartProducts} />
    );
}