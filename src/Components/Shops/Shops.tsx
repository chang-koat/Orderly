import './Shops.css'

function renderShops() {
    //Send request to backend for stores.


}

/*TODO:
    Open shop page:
        Create shop page.
        Wrap shop with link and open shop page, pass data about opened shop.
        Request shop data from backend to load onto the page.
*/

export default function Shops() {
    return (
        <div className="shops">
            <div className="shops_options">
                <input className="shops_searchbar" type="text" placeholder="Search" />
                <div className="shops_filter">Filter</div>
            </div>

            <h2>Featured Shops</h2>
            <div className="shops_container">
                <div className="shops_item">
                    <div className="shops_item_info">
                        <h3>Example Shop</h3>
                        <h4>Distance/rating or some other info here</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}