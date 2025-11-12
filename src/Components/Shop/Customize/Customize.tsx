import './Customize.css'

export default function Customize() {
    return (
        <div className="customize">
            <h1>Customize your Item</h1>
            <h2>Item Name</h2>
            <h5>Item Desc</h5>
            <form id="customize_form">

                <input type="submit" value="Add to Cart" className="add_to_cart"/>
            </form>


        </div>
    )
}