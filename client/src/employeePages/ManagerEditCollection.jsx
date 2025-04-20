import React from 'react'
import EmployeeNav from './EmployeeNav'
import { useState, useEffect } from 'react'
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
    const [exhibits, setExhibits] = useState([])
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

    useEffect(()=>{
        const fetchCollection = async ()=>{
            try{
                console.log("GET Sent")
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/collections/${collectionTitle}`,
                    {
                        headers: {
                            'authorization': `Bearer ${token}`
                        },
                    }
                )
                console.log("GET Completed")
                console.log(res.data)
                setCollection(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchCollection()
    },[])

    useEffect(()=>{
        const fetchAllExhibits = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/exhibits`)
                console.log(res.data)
                setExhibits(res.data);
                
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchAllExhibits()
    },[])
    

    const handleChange = (e) =>{ // given target to given value
        setCollection(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/collections/`, {
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
                    <input type="text" className="manager-edit-collection-input"  value={collection.CollectDesc} placeholder="desc" onChange={handleChange} name="CollectDesc"/>
                    <input type="text"  className="manager-edit-collection-input" value={collection.CollectPic} placeholder="image" onChange={handleChange} name="CollectPic"/>
                    <select className="manager-edit-collection-input" value={collection.ExhibitID || ""} onChange={handleChange} name="ExhibitID">
                        <option value="">--- Select an Exhibit ---</option>
                        {exhibits.map((exhibit) => (
                            <option key={exhibit.ExhibitID} value={exhibit.ExhibitID}>
                                {exhibit.ExhibitName}
                            </option>
                        ))}
                    </select>
                    <button className="manager-edit-collection-formButton" onClick={handleClick} >Update</button>
                </div>
            </div>
        </div>    
        </div>
    )
}

export default ManagerEditCollection