import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

 
const MiscellaneousArt = () => {
    console.log("MiscellaneousArt")
 
    const [artwork, setArtwork] = useState([])

 
     useEffect(()=>{
         const fetchArtwork = async ()=>{
             try{
                console.log("GET Sent")
                 const res = await axios.get(`https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/collection/${null}`);
                 setArtwork(res.data)
                 console.log("GET Completed")
             }catch(err){
                window.alert(err.response.data.error);
             }
         }
         fetchArtwork()
     },[])
 
 
     return(
         
 
         
         <div>
             
             <div>
                 <h1>Miscellaneous Art</h1>
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
 
 export default MiscellaneousArt