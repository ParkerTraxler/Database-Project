import React from 'react'
import EmployeeNav from './EmployeeNav'
 import { useState } from 'react'
 import { useNavigate } from 'react-router-dom'
 import { useAuth } from '../utils/AuthContext'
 import { useLocation } from 'react-router-dom'
 import axios from 'axios'
 import './EmployeeDashboard'
 import './CreateArtwork.css'
 
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
             const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/artworks/`, {
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
            window.alert(err.response.data.error);
         }
     }
     
     return(
        <div className="create-artwork-container">
         <div className="managerView">
             <div>
                <EmployeeNav/>
             </div>
             <div>
                 <div className="create-artwork-form">
                     <h1>Add Artwork</h1>
                     <input className="create-artwork-input" type="text" placeholder="name" onChange={handleChange} name="artName"/>
                     <input className="create-artwork-input" type="text" placeholder="artist" onChange={handleChange} name="artist"/>
                     <input className="create-artwork-input" type="text" placeholder="type" onChange={handleChange} name="type"/>
                     <input className="create-artwork-input" type="number" step="0.01" placeholder="value" onChange={handleChange} name="artVal"/>
                     <input className="create-artwork-input" type="text" placeholder="desc" onChange={handleChange} name="artDesc"/>
                     <input className="create-artwork-input" type="text" placeholder="image" onChange={handleChange} name="artPic"/>
                     <input className="create-artwork-input" type="date" onChange={handleChange} name="dateMade"/>
                     <div>
                     On Display:
                     <select className="create-artwork-input" onChange={handleChange} name="onDisplay">
                         <option value="">---Choose an option---</option>
                         <option value="1">True</option>
                         <option value="0">False</option>
                     </select>
                     </div>
                     <button className="create-artwork-formButton" onClick={handleClick} >Add</button>
                 </div>
             </div>
             
        </div>
         </div>
     )
 }
 
 export default CreateArtwork