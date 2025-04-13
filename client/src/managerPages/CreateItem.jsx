import React from 'react'
import ManagerNav from './ManagerNav'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import './ManagerDashboard.css'
import './CreateItem.css'

const CreateItem = () => {
    console.log("CreateItem")
    const { user } = useAuth()
    const token = user.token
    console.log(token)

    const [item, setItem] = useState({
        itemname:"", 
        itemprice:"", 
        amountinstock:""
    })

    const navigate = useNavigate();

    const handleChange = (e) =>{ // given target to given value
        if (e.target.value < 0) return;
        setItem(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(item)
    }

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click

        console.log("POST Sent")
        
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/items/`, {
                itemname: item.itemname, 
                itemprice: item.itemprice, 
                amountinstock: item.amountinstock
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
        
        <div className="create-item-container">
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div className="add-item-section">
                <div className="form">
                    <h1>Add Item</h1>
                    <input type="text" placeholder="name" onChange={handleChange} name="itemname" className="create-item-input"/>
                    <input type="number" step="0.01" min="0" placeholder="price" onChange={handleChange} name="itemprice" className="create-item-input"/>
                    <input type="number" min="0" placeholder="amount in stock" onChange={handleChange} name="amountinstock" className="create-item-input"/>
                    <button className="formButton-add-item" onClick={handleClick} >Add</button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default CreateItem