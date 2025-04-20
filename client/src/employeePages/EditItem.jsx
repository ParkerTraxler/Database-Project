import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../utils/AuthContext'
import EmployeeNav from './EmployeeNav'
import './EmployeeDashboard.css'
import './EditItem.css'

const EditItem = () => {
    console.log("EditItem")
    const { user } = useAuth()
    const token = user.token
    console.log(token)

    
    const [item, setItem] = useState({ 
        ItemName:"", 
        ItemPrice:"", 
        AmountToAdd:"0",
        ItemImage: ""
    })

    const handleChange = (e) =>{ // given target to given value
        if (e.target.value < 0) return;
        setItem(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(item)
    }

    const navigate = useNavigate()
    const location = useLocation()

    const GiftShopName = decodeURIComponent(location.pathname.split("/")[2])
    const ItemID = location.pathname.split("/")[3]
    console.log(GiftShopName)
    console.log(ItemID)

    useEffect(()=>{
        const fetchItem = async ()=>{
            console.log("ID: " + ItemID)
            try{
                console.log("GET Sent")
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items/${ItemID}`)
                console.log(res.data)
                console.log("GET Completed")
                setItem(res.data)
                console.log(item)
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchItem()
    },[])


    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        console.log("ID: " + ItemID)
        try{
            console.log("PUT Sent")
            const res = await axios.put(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items/`, {
                itemid: ItemID, 
                itemname: item.ItemName, 
                itemprice: item.ItemPrice, 
                itemimage: item.ItemImage,
                giftshopname: GiftShopName
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("PUT Completed")
            console.log(res.data)

            if(item.AmountToAdd > 0){
                console.log("PUT Sent")
                const res2 = await axios.put(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/items/restock`, {
                    itemid: ItemID,
                    amounttoadd: item.AmountToAdd
                },
                {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                })
            }
            
            
            
            navigate("/manage-gift-shop")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    return(
        
        <div className="edit-item-container">
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div>
                <div className="edit-item-form">
                    <h1 className="edit-item-header">Edit Item</h1>
                    <input className="edit-item-input" type="text" value={item.ItemName} placeholder="name" onChange={handleChange} name="ItemName"/>
                    <input className="edit-item-input" type="text" value={item.ItemImage} placeholder="image url" onChange={handleChange} name="ItemImage"/>
                    <input className="edit-item-input" type="number" value={item.ItemPrice} step=".01"  min="0" placeholder="price" onChange={handleChange} name="ItemPrice"/>
                    <input className="edit-item-input" type="number" min="0" value={item.AmountToAdd} placeholder="amount to restock" onChange={handleChange} name="AmountToAdd"/>
                    <div>
                        <button className="edit-item-formButton" onClick={handleClick} >Save Changes</button>
                    </div>
                    
                </div>
            </div>
        </div>    
        </div>
    )
}

export default EditItem