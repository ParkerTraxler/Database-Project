import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import EmployeeNav from './EmployeeNav'
import './EmployeeDashboard.css'
import './ManagerAddCollection.css'

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
            const res = await axios.post(`${process.env.REACT_APP_API}/collections`, {
                
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
        <div className="manager-add-collection-container">
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div>
                <div className="manager-add-collection-section">
                    <h1 className="manager-add-collection-header">Create New Collection</h1>
                    <input className="manager-add-collection-input" type="text" placeholder="title" onChange={handleChange} name="Title"/>
                    <input className="manager-add-collection-input" type="text" placeholder="desc" onChange={handleChange} name="CollectDesc"/>
                    <input className="manager-add-collection-input" type="text" placeholder="image" onChange={handleChange} name="CollectPic"/>
                    <input className="manager-add-collection-input" type="number" placeholder="exhibit id" onChange={handleChange} name="ExhibitID"/>
                    <button className="manager-add-collection-formButton" onClick={handleClick} >Create</button>
                </div>
            </div>
        </div>     
        </div>
    )
}

export default ManagerAddCollection