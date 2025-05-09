import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import EmployeeNav from './EmployeeNav'
import './EmployeeDashboard.css'
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
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/items`);
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
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (!confirmed) return;
        else{
            try{
                const res = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/items/`, {
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
        
    }

    return(
        
        <div className="manage-gift-shop-container">    
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div className="giftshopSectionEm">
                <h1>Manage Gift Shop</h1>
                <div className="giftshopEm">
                {loading ? (
                    <p>Loading items...</p>  // Show a loading message while waiting for data
                ) : (
                    items.length > 0 ? (
                    items.map(item=>(
                        <div className="itemEm" key={item.ItemID}>
                            {item.ItemImage && 
                                <img src={item.ItemImage} alt="" />
                            }
                            <div>{item.ItemName}</div>
                            <div>{"$" + item.ItemPrice}</div>
                            <div>Stock: {item.AmountInStock}</div>
                            <button className="update"><Link to={`/edit-item/${item.GiftShopName}/${item.ItemID}`}>Update</Link></button>
                            <button className="delete" onClick={()=>handleDelete(item.ItemID)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No items found.</p>  // Handle case when tickets array is empty
                ))}
                </div>
                <button className="manage-gift-shop-button">
                    <Link to="/add-item">Add Item</Link>
                </button>
            </div>
            </div>    
        </div>
    )
}

export default ManageGiftShop