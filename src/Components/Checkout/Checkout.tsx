import './Checkout.css'
import {useEffect, useState} from "react";

export default function Checkout() {
    const [items, setItems] = useState<any[]>([]);

    const cart = JSON.parse(sessionStorage.getItem("cart") as string);


    useEffect(() => {
        if (cart === null) {
            setItems([]);
        } else {
            setItems(cart);
        }
    },[])

    const itemsMap = items?.map((item: any, index: number) => (
        <div key={index} className="Checkout_item">

        </div>));

    const emptyCheckout = (
        <div className="Checkout_item">
            <h1>You dont have any items yet!</h1>
        </div>
    );

    return (
        <div className="checkout">
            <h1 className="checkout_title">Checkout</h1>

            <div className="checkout_item_list">
                {itemsMap ? itemsMap : emptyCheckout}
            </div>

            <div className="checkout_details">
                <p id="checkout_price">Total<br/>0.00</p>
                <div className="checkout_purchase_button">Purchase</div>
            </div>
        </div>)
}