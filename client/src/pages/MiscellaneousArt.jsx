import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

 
const MiscellaneousArt = () => {
    console.log("MiscellaneousArt")
 
    const [artwork, setArtwork] = useState([])

 
     useEffect(()=>{
         const fetchArtwork = async ()=>{
             try{
                 const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/collection/${null}`);
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
                 <h1>Miscellaneous Art</h1>
                 <div className="artwork">
                 {artwork.map(art=>(
                     <div className="art" key={art.ArtID}>
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
 
 export default MiscellaneousArt