import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import ManagerDashboard from './ManagerNav'
import './ManagerDashboard.css'
import './ManagerAddCollections.css'

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
            const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/collections`, {
                
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
            window.alert(err.response.data.error);
        }
    }

    return(
        <div className="add-collections-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div className="add-collections-section">
                <div>
                    <h1 className="add-collection-header">Create New Collection</h1>
                    <input className="add-collections-input" type="text" placeholder="title" onChange={handleChange} name="Title"/>
                    <input className="add-collections-input" type="text" placeholder="desc" onChange={handleChange} name="CollectDesc"/>
                    <input className="add-collections-input" type="text" placeholder="image" onChange={handleChange} name="CollectPic"/>
                    <input className="add-collections-input" type="number" placeholder="exhibit id" onChange={handleChange} name="ExhibitID"/>
                    <button className="formButton-add-collection" onClick={handleClick} >Create</button>
                </div>
            </div>
        </div>        
        </div>
    )
}

export default ManagerAddCollection