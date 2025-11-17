import './Shop.css'
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {render} from "@testing-library/react";
import {createPortal, flushSync} from "react-dom";


/*
    TODO:
        If item has customization open up a page for that, otherwise just add to cart.
 */

//How Items will be stored and used, List of items will be stringified and stored in db then parsed to read all items
//Won't be used here but wherever stores are created/managed
class Customization {
    name: string;
    options: string[]; //If using multiple choice otherwise leave as empty array and will be interpreted as a bool choice
    //add potential price change base on options

    constructor(name: string, options: string[]) {
        this.name = name;
        this.options = options;
    }
}

class Item {
    name: string;
    description: string;
    price: number;
    customizations: Customization[];

    constructor(name: string, description: string, price: number, customizations: Customization[]) {
        this.name = name;
        this.description = description;
        this.price = price
        this.customizations = customizations;
    }
}


export default function Shop() {
    /*
    Created some simple Items to add for testing purposes
    let items = []
    items.push(new Item("Pizza", "Fresh delicious Pizza!", 7.99, [new Customization("Toppings", ["Pepperoni", "Cheese", "Sausage"]), new Customization("Stuffed Crust", [])]))
    items.push(new Item("Burger", "A really good burger!", 8.99, [new Customization("Bacon", [])]))
    items.push(new Item("Fries", "A good side for out great burgers!", 2.99, [])

    console.log(JSON.stringify(items));
     */
    const [items, setItems] = useState<any[]>([]);
    const [customization, setCustomization] = useState<any[]>([]);
    const [showCustomize, setShowCustomize] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    async function renderShop() {
        //request all shop data from backend and load it here
        if (state != null) {
            //Load store data
            document.getElementById('shop_name')!!.innerText = state!['Name']
            document.getElementById('shop_desc')!!.innerText = state!['Description']
            let data = JSON.parse(state!['Items'])
            setItems(data)
        } else {
            //Only for testing!!
            document.getElementById('shop_name')!!.innerText = "This is a test page"
            document.getElementById('shop_desc')!!.innerText = "This is meant for testing the websites functionality"
            let items = []
            items.push(new Item("Pizza", "Fresh delicious Pizza!", 7.99, [new Customization("Toppings", ["Pepperoni", "Cheese", "Sausage"]), new Customization("Stuffed Crust", [])]))
            items.push(new Item("Burger", "A really good burger!", 8.99, [new Customization("Bacon", [])]))
            items.push(new Item("Fries", "A good side for out great burgers!", 2.99, []))
            setItems(items)
        }
    }

    function addToCart(item: any) {
        //Check if customization is needed and open page
        if (item.customizations.length > 0) {
            setShowCustomize(true);
            setSelectedItem(item)
            let customizationData: {[key: string]: string} = {};
            flushSync(() => { //This is temporary and bad practice, I'm only using this because I dont know how else to yet
                setCustomization(item.customizations)
            })
            customization.forEach((item2: any) => {
                customizationData[item2.name] = "";
            })
        }

        let list = JSON.parse(sessionStorage.getItem('cart') as string);
        if (list != null) {
            let items = []
            items.push(list)
            items.push(item);
            sessionStorage.setItem('cart', JSON.stringify(items));
        } else {
            sessionStorage.setItem('cart', JSON.stringify(item));
        }
    }

    const location = useLocation();
    const state = location.state?.store || null;
    useEffect(() => {
        renderShop();
    }, []);

    function purchase() {
        //get order data and move to purchase page
    }


    return (
        <div className="shop" id="shop">
            {showCustomize && selectedItem && (
                <div className="customize">
                    <h1>Customize your Item</h1>
                    <h2>{selectedItem.name}</h2>
                    <h5>{selectedItem.description}</h5>
                    <form id="customize_form">
                        {customization.map((item: any, index: number) => (
                            <div className="form_customization">
                                <p>{item.name}</p>
                                {item.options ?
                                    (<select className="form_select" key={index}>{item.options.map((option: any, op_index: number) => {
                                            <option className="form_select_option" value={option} key={op_index}>testing</option>
                                        })}</select>
                                    ) : (<label className="form_bool_label"><input className="form_choice form_bool" type="checkbox" key={index}/>{item.name}</label> )}
                            </div>
                        ))}
                        <input type="submit" value="Add to Cart" className="add_to_cart" onSubmit={purchase}/>
                    </form>
                </div>
            )}
            <div className="shop_info">
                <h1 id="shop_name">Example Shop</h1>
                <h5 id="shop_desc">Shop description</h5>
            </div>

            <div className="shop_options">
                <input className="shop_searchbar" type="text" placeholder="Search" />
                <div className="shop_filter">Filter</div>
            </div>

            <div className="shop_items_container" id="shop_items_container">
                <div className="shop_section"><div className="section_title">Item Section</div><div className="shop_divider"/></div>
                {items.map((item, index) => (
                    <div className="shop_item" key={index}>
                        <div className="shop_item_title">{item.name}</div>
                        <div className="shop_item_description">{item.description}</div>
                        <div className="shop_item_price">{item.price}</div>
                        <div className="shop_item_buy" onClick={() => {addToCart(item)}} key={item.name}>Add to Cart</div>
                    </div>
                ))}
            </div>
        </div>
    )
}