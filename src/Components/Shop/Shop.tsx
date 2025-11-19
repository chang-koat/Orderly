import './Shop.css'
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";


/*
    TODO:
        Should "work" but overall could use some tweaks to make it work better and be more functional and easy for the user.
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
    const [storeItems, setStoreItems] = useState<any[]>([]);
    const [customization, setCustomization] = useState<any[]>([]);
    const [showCustomize, setShowCustomize] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    function clone<T>(obj: T): T { //To avoid changing the original variable
        return JSON.parse(JSON.stringify(obj));
    }

    function showCustomizationMenu(item: any) {
        if (item.customizations.length > 0) {
            setShowCustomize(true);
            setSelectedItem(item)
            setCustomization(item.customizations)
        } else {
            addToCart(item)
        }
    }

    function closeCustomization() {
        setShowCustomize(false);
        setSelectedItem(null);
        setCustomization([]);
    }

    function addToCart(item: any, event?: any, customization?: any) {
        let purchaseItem = clone(item)
        if (event != null) {
            event.preventDefault();
            if (customization != null) {
                const formData = new FormData(event.target);
                purchaseItem.customizations = Object.fromEntries(formData.entries());
            }
        }

        let list = JSON.parse(sessionStorage.getItem('cart') as string);
        if (list != null) {
            let items: any[] = []
            items = items.concat(list);
            items.push(purchaseItem);
            sessionStorage.setItem('cart', JSON.stringify(items));
        } else {
            sessionStorage.setItem('cart', JSON.stringify(purchaseItem));
        }
        setShowAlert(true);
        const timer = setTimeout(() => {
            setShowAlert(false);
            clearTimeout(timer)
        }, 6000)
    }

    const location = useLocation();
    const state = location.state?.store || null;

    async function renderShop() {
        //request all shop data from backend and load it here
        if (state != null) {
            //Load store data
            document.getElementById('shop_name')!!.innerText = state!['Name']
            document.getElementById('shop_desc')!!.innerText = state!['Description']
            let data = JSON.parse(state!['Items'])
            setStoreItems(data)
        } else {
            //Only for testing!! Can be changed to tell user the page is empty once finished
            document.getElementById('shop_name')!!.innerText = "This is a test page"
            document.getElementById('shop_desc')!!.innerText = "This is meant for testing the websites functionality"
            let items = []
            items.push(new Item("Pizza", "Fresh delicious Pizza!", 7.99, [new Customization("Toppings", ["Pepperoni", "Cheese", "Sausage"]), new Customization("Stuffed Crust", [])]))
            items.push(new Item("Burger", "A really good burger!", 8.99, [new Customization("Bacon", [])]))
            items.push(new Item("Fries", "A good side for out great burgers!", 2.99, []))
            setStoreItems(items)
        }
    }

    useEffect(() => {
        renderShop();
    }, []);

    return (
        <div className="shop" id="shop">
            {showCustomize && selectedItem && (
                <div className="customize">
                    <div className="customize_cancel_button" onClick={() => {closeCustomization()}}>X</div>
                    <h1>Customize your Item</h1>
                    <h2>{selectedItem.name}</h2>
                    <h5>{selectedItem.description}</h5>
                    <form id="customize_form" method="dialog" onSubmit={(e) => {addToCart(selectedItem, e, true); closeCustomization() }}>
                        {customization.map((item: any, index: number) => (
                            <div className="form_customization">
                                <p>{item.name}</p>
                                {item.options.length > 0 ?
                                    (<select className="form_select" key={index} name={item.name}>
                                            {item.options.map((option: any, op_index: number) => (
                                            <option className="form_select_option" value={option} key={op_index}>{option}</option>))}
                                    </select>
                                    ) : (<><input type="hidden" value="0" name={item.name}/><input className="form_choice form_bool" type="checkbox" value="1" key={index} name={item.name}/></>)}
                            </div>
                        ))}
                        <input type="submit" value="Add to Cart" className="add_to_cart"/>
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
                {storeItems.map((item, index) => (
                    <div className="shop_item" key={index}>
                        <div className="shop_item_title">{item.name}</div>
                        <div className="shop_item_description">{item.description}</div>
                        <div className="shop_item_price">{item.price}</div>
                        <div className="shop_item_buy" onClick={() => {showCustomizationMenu(item)}} key={item.name}>Add to Cart</div>
                    </div>
                ))}
            </div>
            {showAlert && (<div className="shop_added_popup">Item was added to cart!</div>)}
        </div>
    )
}