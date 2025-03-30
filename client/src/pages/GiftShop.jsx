import React from 'react'
import axios from 'axios'
import './GiftShop.css'
import { useState, useEffect } from 'react'

const GiftShop = () => {
    console.log("GiftShop")
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchItems = async () => {
            try {
                console.log("GET Sent")
                const res = await axios.get("http://localhost:3002/items");
                console.log("GET Completed")
                console.log(res.data)
                setItems(res.data);  // Store the data once fetched
                console.log(items)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);  // Stop loading after request completes
            }
        };
        fetchItems();
    }, []);


    return(
        <div>
            <div className="giftshopBanner">
                <h1>Gift Shop</h1>
            </div>
            <div>
                <h1>Gift Shop</h1>
                <div className="giftshopBody">
                    {loading ? (
                        <p>Loading items...</p>  // Show a loading message while waiting for data
                    ) : (
                        items.length > 0 ? (
                        items.map(item=>(
                            <div className="item" key={item.ItemID}>
                                <div>{item.ItemName}</div>
                                <div>{"$" + item.ItemPrice}</div>
                                <div>Stock: {item.AmountInStock}</div>
                                
                            </div>
                        ))
                    ) : (
                        <p className="no-items-message">No items currently available.</p>  // Handle case when item array is empty
                    ))}
                </div>
            </div>
        </div> 
    )
}

export default GiftShop