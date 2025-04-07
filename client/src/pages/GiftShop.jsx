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
                const res = await axios.get("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items");
                setItems(res.data);  // Store the data once fetched
            } catch (err) {
                window.alert(err.response.data.error);
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
                <div className="giftshopCu">
                    {loading ? (
                        <p>Loading items...</p>  // Show a loading message while waiting for data
                    ) : (
                        items.length > 0 ? (
                        items.map(item=>(
                            <div className="itemCu" key={item.ItemID}>
                                {item.ItemImage && 
                                    <img src={item.ItemImage} alt="" />
                                }
                                <div>{item.ItemName}</div>
                                <div>{"$" + item.ItemPrice}</div>
                                {item.isPurchasable == '0' && (
                                    <div>Out of Stock.</div>
                                )}
                                
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