import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import './CollectionArt.css';
 
const CollectionArt = () => {
    console.log("CollectionArt")
 
    const [artwork, setArtwork] = useState([])
     
    const location = useLocation()
     
    const urlTitle = location.pathname.split("/")[2]
    const collectionTitle = urlTitle.replaceAll("%20", " ");
     
    console.log(encodeURIComponent(collectionTitle))
 
     useEffect(()=>{
         const fetchArtwork = async ()=>{
             console.log(collectionTitle)
             try{
                 const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/collection/${encodeURIComponent(collectionTitle)}`);
                 console.log(res.data)
                 setArtwork(res.data)
                 console.log(artwork.data)
             }catch(err){
                window.alert(err.response.data.error);
             }
         }
         fetchArtwork()
     },[])
 
 
     return(
         
 
         
         <div>
             
             <div>
                 <h1>{collectionTitle}</h1>
                 <div className="artworksCu">
                 {artwork.map(art=>(
                     <div className="artCu" key={art.ArtID}>
                         {art.ArtPic && 
                             <img src={art.ArtPic} alt="" />                     
                         }
                         <div>Piece: {art.ArtName}</div>
                         <div>Artist: {art.Artist}</div>
                         <div>Value: {art.ArtVal}</div>
                         
                         <div>Date Made: {art.DateMade != null ? new Date(art.DateMade).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "Unknown"}</div>
                         <p>Desc: {art.ArtDesc}</p>
                         
                         
                     </div>
                 ))}
                 </div>
             </div>
             
         </div>
     )
 }
 
 export default CollectionArt