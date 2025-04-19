import React from 'react'
import EmployeeNav from './EmployeeNav'
 import { useState } from 'react'
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
 
     const [artwork, setArtwork] = useState({
             artName:"", 
             artist:"", 
             dateMade:"", 
             artType:"", 
             artVal:"", 
             collection:"", 
             artDesc:"", 
             artPic:"", 
             onDisplay:"",
     })
 
     const handleChange = (e) =>{ // given target to given value
         console.log(e.target.name, e.target.value);
         
         setArtwork(prev=>({...prev, [e.target.name]: e.target.value}))
         console.log(artwork)
     }
 
     const navigate = useNavigate()
     const location = useLocation()
     
     const artID = location.pathname.split("/")[2]
 
     const handleClick = async e =>{ //do async for api requests
         e.preventDefault()  //prevents page refresh on button click
         console.log("ID: " + artID)
         console.log(artwork)
         try{
             const res = await axios.put(`http://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/`, {
                 artID: artID,
                 artName: artwork.artName, 
                 artist: artwork.artist, 
                 dateMade: artwork.dateMade, 
                 artType: artwork.artType, 
                 artVal: artwork.artVal, 
                 collection: artwork.collection, 
                 artDesc: artwork.artDesc, 
                 artPic: artwork.artPic, 
                 onDisplay: artwork.onDisplay,
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
                     <input className="edit-artwork-input" type="text" placeholder="name" onChange={handleChange} name="artName"/>
                     <input className="edit-artwork-input" type="text" placeholder="artist" onChange={handleChange} name="artist"/>
                     <input className="edit-artwork-input" type="text" placeholder="type" onChange={handleChange} name="type"/>
                     <input className="edit-artwork-input" type="number" step="0.01" placeholder="value" onChange={handleChange} name="artVal"/>
                     <input className="edit-artwork-input" type="text" placeholder="desc" onChange={handleChange} name="artDesc"/>
                     <input className="edit-artwork-input" type="text" placeholder="collection" onChange={handleChange} name="collection"/>
                     <input className="edit-artwork-input" type="text" placeholder="image" onChange={handleChange} name="artPic"/>
                     <input className="edit-artwork-input" type="date" onChange={handleChange} name="dateMade"/>
                     <div>
                     On Display:
                     <select  className="edit-artwork-input"  onChange={handleChange} name="onDisplay">
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