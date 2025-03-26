import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'

const ManagerAddCollection = () => {
    console.log("ManagerAddCollection")
    const { user } = useAuth()
    const token = user.token
    console.log(token)

    const [collection, setCollection] = useState({
        Title:"",
        CollectDesc:"",
        CollectPic:"",
        ExhibitID: null,
    })

    const handleChange = (e) =>{ // given target to given value
        
        setCollection(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(collection)
    }

    const navigate = useNavigate()

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.post("https://green-ground-0dc4ce31e.6.azurestaticapps.net/collections", {
                
                title: collection.Title,
                collectdesc: collection.CollectDesc,
                collectpic: collection.CollectPic,
                exhibitid: collection.ExhibitID,
                
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log(res.end)
            
            navigate("/manage-collections")
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manager Add Collection
                <div className="form">
                    <h1>Create New Collection</h1>
                    <input type="text" placeholder="title" onChange={handleChange} name="Title"/>
                    <input type="text" placeholder="desc" onChange={handleChange} name="CollectDesc"/>
                    <input type="text" placeholder="image" onChange={handleChange} name="CollectPic"/>
                    <input type="number" placeholder="exhibit id" onChange={handleChange} name="ExhibitID"/>
                    <button className="formButton" onClick={handleClick} >Create</button>
                </div>
            </div>
            
        </div>
    )
}

export default ManagerAddCollection