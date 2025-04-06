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
                 const res = await axios.get(`http://localhost:3002/artworks/collection/${encodeURIComponent(collectionTitle)}`);
                 console.log(res.data)
                 setArtwork(res.data)
                 console.log(artwork.data)
             }catch(err){
                 console.log(err)
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
                         
                         <div>Date Made: {new Date(art.DateMade).toLocaleDateString()}</div>
                         <p>Desc: {art.ArtDesc}</p>
                         
                         
                     </div>
                 ))}
                 </div>
             </div>
             
         </div>
     )
 }
 
 export default CollectionArt