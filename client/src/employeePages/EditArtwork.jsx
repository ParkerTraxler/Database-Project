import React from 'react'
import EmployeeNav from './EmployeeNav'
 import { useState, useEffect } from 'react'
 import { useLocation } from 'react-router-dom'
 import { useNavigate } from 'react-router-dom'
 import axios from 'axios'
 import { useAuth } from '../utils/AuthContext'
 import './EmployeeDashboard.css'
 import './EditArtwork.css'
 
 const EditArtwork = () => {
     console.log("EditArtwork")
     const { user } = useAuth()
     const token = user.token
     console.log(token)
    
     const [collections, setCollections] = useState([])
     const [artwork, setArtwork] = useState({
        ArtName:"", 
        Artist:"", 
        DateMade:"", 
        ArtType:"", 
        ArtVal:"", 
        Collection:"", 
        ArtDesc:"", 
        ArtPic:"", 
        OnDisplay:"",
     })
 
     const handleChange = (e) =>{ // given target to given value
         console.log(e.target.name, e.target.value);
         
         setArtwork(prev=>({...prev, [e.target.name]: e.target.value}))
         console.log(artwork)
     }

     useEffect(()=>{
        const fetchAllCollections = async ()=>{
            try{
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/collections`)
                console.log(res.data)
                setCollections(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllCollections()
    },[])
 
     const navigate = useNavigate()
     const location = useLocation()
     
     const artID = location.pathname.split("/")[2]

    useEffect(()=>{
        const fetchItem = async ()=>{
            console.log("ID: " + artID)
            try{
                console.log("GET Sent")
                const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/${artID}`)
                console.log(res.data)
                console.log("GET Completed")
                setArtwork(res.data)
                console.log(artwork)
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchItem()
    },[])
 
     const handleClick = async e =>{ //do async for api requests
         e.preventDefault()  //prevents page refresh on button click
         console.log("ID: " + artID)
         console.log(artwork)
         try{
             const res = await axios.put(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/`, {
                 artID: artID,
                 artName: artwork.ArtName, 
                 artist: artwork.Artist, 
                 dateMade: artwork.DateMade ? artwork.DateMade.split("T")[0] : null, 
                 artType: artwork.ArtType, 
                 artVal: artwork.ArtVal, 
                 collection: artwork.Collection, 
                 artDesc: artwork.ArtDesc, 
                 artPic: artwork.ArtPic, 
                 onDisplay: artwork.OnDisplay,
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
         
        <div className="edit-artwork-container"> 
         <div className="managerView">
             <div>
                 <EmployeeNav/>
             </div>
             <div>
                 
                 <div className="edit-artwork-form">
                     <h1>Edit Artwork</h1>
                     <input className="edit-artwork-input" type="text" value={artwork.ArtName} placeholder="name" onChange={handleChange} name="ArtName"/>
                     <input className="edit-artwork-input" type="text" value={artwork.Artist} placeholder="artist" onChange={handleChange} name="Artist"/>
                     <input className="edit-artwork-input" type="text" value={artwork.ArtType} placeholder="type" onChange={handleChange} name="ArtType"/>
                     <input className="edit-artwork-input" type="number" value={artwork.ArtVal} step="0.01" placeholder="value" onChange={handleChange} name="ArtVal"/>
                     <input className="edit-artwork-input" type="text" value={artwork.ArtDesc} placeholder="desc" onChange={handleChange} name="ArtDesc"/>
                     <select className="edit-artwork-input" value={artwork.Collection || ""} onChange={handleChange} name="Collection">
                        <option value="">--- Select an Exhibit ---</option>
                        {collections.map((collection) => (
                            <option key={collection.Title} value={collection.Title}>
                                {collection.Title}
                            </option>
                        ))}
                    </select>
                     <input className="edit-artwork-input" type="text" value={artwork.ArtPic} placeholder="image" onChange={handleChange} name="ArtPic"/>
                     <input className="edit-artwork-input" type="date" value={artwork?.DateMade ? new Date(artwork.DateMade).toISOString().split("T")[0] : ""} onChange={handleChange} name="DateMade"/>
                     <div>
                     On Display:
                     <select  className="edit-artwork-input" value={artwork.OnDisplay}  onChange={handleChange} name="onDisplay">
                         <option value="">---Choose an option---</option>
                         <option value="1">True</option>
                         <option value="0">False</option>
                     </select>
                     </div>
                     <button className="edit-artwork-formButton" onClick={handleClick} >Save Changes</button>
                 </div>
             </div>
        </div>     
         </div>
     )
 }
 
 export default EditArtwork