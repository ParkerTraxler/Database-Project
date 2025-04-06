import React from 'react'
import EmployeeNav from './EmployeeNav'
 import { useState } from 'react'
 import { useNavigate } from 'react-router-dom'
 import { useAuth } from '../utils/AuthContext'
 import { useLocation } from 'react-router-dom'
 import axios from 'axios'
 import './EmployeeDashboard'
 
 const CreateArtwork = () => {
     console.log("CreateArtwork")
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
     
     const urlTitle = location.pathname.split("/")[2]
     const collectionTitle = urlTitle.replaceAll("%20", " ");
 
     const handleClick = async e =>{ //do async for api requests
         e.preventDefault()  //prevents page refresh on button click
         console.log(collectionTitle)
         console.log(artwork)
         try{
             const res = await axios.post("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/", {
                 artName: artwork.artName, 
                 artist: artwork.artist, 
                 dateMade: artwork.dateMade, 
                 artType: artwork.artType, 
                 artVal: artwork.artVal, 
                 collection: collectionTitle, 
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
             
             navigate(`/manage-collection-art/${collectionTitle}`)
         }
         catch(err){
             console.log(err)
         }
     }
     
     return(
         <div className="managerView">
             <div>
                <EmployeeNav/>
             </div>
             <div>
                 <div className="form">
                     <h1>Add Artwork</h1>
                     <input type="text" placeholder="name" onChange={handleChange} name="artName"/>
                     <input type="text" placeholder="artist" onChange={handleChange} name="artist"/>
                     <input type="text" placeholder="type" onChange={handleChange} name="type"/>
                     <input type="number" step="0.01" placeholder="value" onChange={handleChange} name="artVal"/>
                     <input type="text" placeholder="desc" onChange={handleChange} name="artDesc"/>
                     <input type="text" placeholder="image" onChange={handleChange} name="artPic"/>
                     <input type="date" onChange={handleChange} name="dateMade"/>
                     <div>
                     On Display:
                     <select onChange={handleChange} name="onDisplay">
                         <option value="">---Choose an option---</option>
                         <option value="1">True</option>
                         <option value="0">False</option>
                     </select>
                     </div>
                     <button className="formButton" onClick={handleClick} >Add</button>
                 </div>
             </div>
             
         </div>
     )
 }
 
 export default CreateArtwork