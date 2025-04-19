import React from 'react'
import EmployeeNav from './EmployeeNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './EmployeeDashboard.css'
import './ManageCollections.css'

const ManageCollections = () => {
    console.log("ManageCollections")


    const [collections, setCollections] = useState([])
    const { user } = useAuth()
    const token = user.token
    console.log("token: " + token)

    useEffect(()=>{
        const fetchAllCollections = async ()=>{
            try{
                const res = await axios.get(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/collections`)
                console.log(res.data)
                setCollections(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllCollections()
    },[])

    const handleDelete = async (title)=>{
        console.log(title)
        const confirmed = window.confirm("Are you sure you want to delete this collection?");
        if (!confirmed) return;
        else{
            try{
                const res = await axios.delete(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/collections/`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    data: {title: title}
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
        <div className= "manage-collections-container">
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div className="manageCollectionSectionEm">
                <h1>Collections</h1>
                <div className="collectionsM">
                {collections.map(collection=>(
                    <div className="collectionM" key={collection.Title}>
                        {collection.CollectPic && 
                            <Link to={`/manage-collection-art/${collection.Title}`}>
                                <img src={collection.CollectPic} alt="" />
                            </Link>
                        }
                        <h2>{collection.Title}</h2>
                        <p>{collection.CollectDesc}</p>
                        <button className="delete" onClick={()=>handleDelete(collection.Title)}>Delete</button>
                        <button className="update"><Link to={`/edit-collection/${collection.Title}`}>Update</Link></button>
                    </div>
                ))}
                </div>
                <button className="manageCollectionSectionButton">
                    <Link to="/add-collection">Create Collection</Link>
                </button>
            </div>
        </div>    
        </div>
    )
}

export default ManageCollections