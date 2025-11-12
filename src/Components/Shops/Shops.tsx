import './Shops.css'
import Cookies from "universal-cookie";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
/*TODO:
    Open shop page:
        Create shop page.
        Wrap shop with link and open shop page, pass data about opened shop.
        Request shop data from backend to load onto the page.
*/

export default function Shops() {

    let nav = useNavigate()
    const [stores, setStores] = useState([]);

    async function renderShops() {
        //Send request to backend for stores.
        const cookies = new Cookies()
        const response = await axios.post('/api/stores/', {
                message: 'Load All Stores'},
            {withCredentials: true,
                headers: {"X-CSRFToken": cookies.get("csrftoken")}})
            .then(response => {
                //Load stores
                let data = response.data
                setStores(data)
            })

    }

    useEffect(() => {
        renderShops()
    }, [])

    return (
        <div className="shops">
            <div className="shops_options">
                <input className="shops_searchbar" type="text" placeholder="Search" />
                <div className="shops_filter">Filter</div>
            </div>

            <h2>Featured Shops</h2>
            <div className="shops_container" id="shops_container">
                {stores.map((store, index) => (
                    <div className="shops_item" onClick={() => {nav('/shop', {state: {store: store}})}}>
                        <div className="shops_item_info">
                            <h3>{store['Name']}</h3>
                            <h4>Distance/rating or some other info here</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}