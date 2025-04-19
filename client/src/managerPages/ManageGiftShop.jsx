import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import ManagerNav from './ManagerNav'
import './ManagerDashboard.css'
import './ManageGiftShop.css'

const ManageGiftShop = () => {
    console.log("ManagerGiftShop")
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()
    const token = user.token
    console.log("token: " + token)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                console.log("GET Sent")
                const res = await axios.get("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items");
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

    const handleDelete = async (itemid)=>{
        console.log(itemid)
        try{
            const res = await axios.delete("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items/", {
                headers: {
                    'authorization': `Bearer ${token}`
                },
                data: {itemid: itemid}
            })
            console.log(res.data)
            window.location.reload() //refreshes the page
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    return(
        
        <div className="manage-gift-shop-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div className="manage-gift-shop-section">
                <h1 className="manage-gift-shop-header">Manage Gift Shop</h1>
                {loading ? (
                    <p>Loading items...</p>  
                ) : (
                    items.length > 0 ? (
                    items.map(item=>(
                        <div className="item" key={item.ItemID}>
                            <div>{item.ItemName}</div>
                            <div>{"$" + item.ItemPrice}</div>
                            <div>Stock: {item.AmountInStock}</div>
                            <button className="update"><Link to={`/edit-item/${item.GiftShopName}/${item.ItemID}`}>Update</Link></button>
                            <button className="delete" onClick={()=>handleDelete(item.ItemID)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No items found.</p> 
                ))}
                <button className ="gift-shop-add-item-button">
                    <Link to="/add-item">Add Item</Link>
                </button>
            </div>
        </div>
        </div>
    )
}

export default ManageGiftShop