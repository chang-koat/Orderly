import './Shop.css'


/*
    TODO:
        If item has customization open up a page for that, otherwise just add to cart.
 */

export default function Shop() {
    return (
        <div className="shop">
            <div className="shop_info">
                <h1>Example Shop</h1>
                <h5>Shop description</h5>
            </div>

            <div className="shop_options">
                <input className="shop_searchbar" type="text" placeholder="Search" />
                <div className="shop_filter">Filter</div>
            </div>

            <div className="shop_items_container">
                <div className="shop_section"><div className="section_title">Item Section</div><div className="shop_divider"/></div>
                <div className="shop_item">
                    <div className="shop_item_title">Item Name</div>
                    <div className="shop_item_description">Short description about the item.</div>
                    <div className="shop_item_buy">Add to Cart</div>
                </div>
            </div>
        </div>
    )
}