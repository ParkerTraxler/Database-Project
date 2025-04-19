import React from 'react'
import EmployeeNav from './EmployeeNav'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './EmployeeDashboard.css'
import './ManagerEditCollection.css'

const ManagerEditCollection = () => {
    console.log("ManagerEditCollection")
    const { user } = useAuth()
    const token = user.token
    const [collection, setCollection] = useState({

        CollectDesc:"",
        CollectPic:"",
        ExhibitID: null,
    })

    const navigate = useNavigate()
    const location = useLocation()
    
    const urlTitle = location.pathname.split("/")[2]
    const collectionTitle = urlTitle.replaceAll("%20", " ");
    console.log(collectionTitle)
    

    const handleChange = (e) =>{ // given target to given value
        setCollection(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`${process.env.REACT_APP_API}/collections/`, {
                title: collectionTitle,
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
        
        <div className="manager-edit-collection-container">
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div>
                <div className="manager-edit-collection-form">
                    <h1>Edit Collection</h1>
                    <input type="text" className="manager-edit-collection-input" placeholder="desc" onChange={handleChange} name="CollectDesc"/>
                    <input type="text"  className="manager-edit-collection-input" placeholder="image" onChange={handleChange} name="CollectPic"/>
                    <input type="number"  className="manager-edit-collection-input" placeholder="exhibit id" onChange={handleChange} name="ExhibitID"/>
                    <button className="manager-edit-collection-formButton" onClick={handleClick} >Update</button>
                </div>
            </div>
        </div>    
        </div>
    )
}

export default ManagerEditCollection