import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../utils/AuthContext'
import EmployeeNav from './EmployeeNav'
import './EmployeeDashboard.css'

const EditItem = () => {
    console.log("EditItem")
    const { user } = useAuth()
    const token = user.token
    console.log(token)

    const [item, setItem] = useState({ 
        itemname:"", 
        itemprice:"", 
        amounttoadd:"0",
        itemimage: ""
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

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        console.log("ID: " + ItemID)
        try{
            console.log("PUT Sent")
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/items/`, {
                itemid: ItemID, 
                itemname: item.itemname, 
                itemprice: item.itemprice, 
                itemimage: item.itemimage,
                giftshopname: GiftShopName
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("PUT Completed")
            console.log(res.data)

            console.log("PUT Sent")
            const res2 = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/items/restock`, {
                itemid: ItemID,
                amounttoadd: item.amounttoadd
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            
            
            navigate("/manage-gift-shop")
        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    return(
        
        
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div>
                <div className="form">
                    <h1>Edit Item</h1>
                    <input type="text" placeholder="name" onChange={handleChange} name="itemname"/>
                    <input type="text" placeholder="image url" onChange={handleChange} name="itemimage"/>
                    <input type="text" min="0" placeholder="price" onChange={handleChange} name="itemprice"/>
                    <input type="number" min="0" placeholder="amount to restock" onChange={handleChange} name="amounttoadd"/>
                    <div>
                        <button className="formButton" onClick={handleClick} >Save Changes</button>
                    </div>
                    
                </div>
            </div>
            
        </div>
    )
}

export default EditItem