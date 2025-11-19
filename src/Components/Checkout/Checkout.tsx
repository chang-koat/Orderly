import './Checkout.css'
import React, {useEffect, useState} from "react";

export default function Checkout() {
    const [items, setItems] = useState<any[]>([]);

    const cart = JSON.parse(sessionStorage.getItem("cart") as string);

    useEffect(() => {
        if (cart === null) {
            setItems([]);
        } else {
            let price: number = 0
            for (let item of cart) {
                price += item.price
                console.log("new item")
                let options: any[] = []

                for (let option of Object.entries(item.customizations)) {
                    if (option.length === 2) {//Customzations are a little messed up at them moment so this is needed
                        if (option[1] === "1") {
                            console.log("option true bool", option, "adding", option[0], options)
                            options.push(option[0])
                        } else if (option[1] === "0") {
                            console.log("option false bool", option, options);
                            //do nothing for now
                        } else {
                            console.log("option mult choice", option, "adding", option[1], options);
                            options.push(option[1])
                        }
                    }
                    console.log(options)
                }
                item.customizations = options
            }
            setItems(cart);
            document.getElementById("checkout_price")!!.innerText = price.toString();
        }

        
    },[])

    function removeFromCart(item: any, index: number, event: any) {
        //Maybe set Prompt if the user is sure they want to delete the item.

        const cart = JSON.parse(sessionStorage.getItem("cart") as string);
        cart.splice(index, 1);
        sessionStorage.setItem("cart", JSON.stringify(cart));
        (event.target as HTMLDivElement).parentElement!.remove();
    }

    function purchase() {

    }

    return (
        <div className="checkout">
            <h1 className="checkout_title">Checkout</h1>

            <div className="checkout_item_list">
                {items.length > 0 ? items.map((item: any, index: number) => (
                    <div key={index} className="checkout_item">
                        <div className="checkout_item_title">{item.name}</div>
                        <div className="checkout_remove_item" onClick={(e) => {removeFromCart(item, index, e)}}>X</div>
                        <div className="checkout_item_description">{item.description}</div>
                        <div className="checkout_item_price">{item.price}</div>
                        <div className="checkout_item_customizations">Customizations:
                            {item.customizations.map((option: any ) => (
                                <p>{option}</p>
                            ))}
                        </div>
                    </div>)) : <h1>You dont have any items yet!</h1>}
            </div>

            <div className="checkout_details">
                <p id="checkout_price">Total<br/>0.00</p>
                <div className="checkout_purchase_button" onClick={purchase}>Purchase</div>
            </div>
        </div>)
}