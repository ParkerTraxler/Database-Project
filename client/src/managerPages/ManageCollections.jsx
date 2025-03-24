import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './ManagerDashboard.css'
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
                const res = await axios.get("http://localhost:3002/collections")
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
        try{
            const res = await axios.delete("http://localhost:3002/collections/", {
                headers: {
                    'authorization': `Bearer ${token}`
                },
                data: {title: title}
            })
            console.log(res.data)
            window.location.reload() //refreshes the page
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
                Manage Collections
                <h1>Collections</h1>
                <div className="collections">
                {collections.map(collection=>(
                    <div className="collection" key={collection.Title}>
                        {collection.CollectPic && <img src={collection.CollectPic} alt="" />}
                        <h2>{collection.Title}</h2>
                        <p>{collection.CollectDesc}</p>
                        <button className="delete" onClick={()=>handleDelete(collection.Title)}>Delete</button>
                        <button className="update"><Link to={`/edit-collection/${collection.Title}`}>Update</Link></button>
                    </div>
                ))}
                </div>
                <button>
                    <Link to="/add-collection">Create Collection</Link>
                </button>
            </div>
            
        </div>
    )
}

export default ManageCollections