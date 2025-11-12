import './Shop.css'
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";


/*
    TODO:
        If item has customization open up a page for that, otherwise just add to cart.
 */

//How Items will be stored and used, List of items will be stringified and stored in db then parsed to read all items
//Won't be used here but wherever stores are created/managed
class Customization {
    name: string;
    options: string[]; //If using multiple choice otherwise leave null or empty and will be interpreted as a bool choice

    constructor(name: string, options: string[]) {
        this.name = name;
        this.options = options;
    }
}

class Item {
    name: string;
    description: string;
    customizations: Customization[];

    constructor(name: string, description: string, customizations: Customization[]) {
        this.name = name;
        this.description = description;
        this.customizations = customizations;
    }
}

export default function Shop() {
    /*
    Created some simple Items to add for testing purposes
    let items = []
    items.push(new Item("Pizza", "Fresh delicious Pizza!", [new Customization("Toppings", ["Pepperoni", "Cheese", "Sausage"]), new Customization("Stuffed Crust", [])]))
    items.push(new Item("Burger", "A really good burger", [new Customization("Bacon", [])]))

    console.log(JSON.stringify(items));
     */

    const [items, setItems] = useState<any[]>([]);


    function addToCart() {
        //Save items to list on session storage to be retrieved when checking out
    }

    async function renderShop() {
        //request all shop data from backend and load it here
        if (state != null) {
            //Load store data
            document.getElementById('shop_name')!!.innerText = state!['Name']
            document.getElementById('shop_desc')!!.innerText = state!['Description']
            let data = JSON.parse(state!['Items'])
            setItems(data)
        }
    }

    const location = useLocation();
    const state = location.state?.store || null;
    useEffect(() => {
        renderShop();
    }, []);


    return (
        <div className="shop">
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
                        <div className="shop_item_buy">Add to Cart</div>
                    </div>
                ))}
            </div>
        </div>
    )
}