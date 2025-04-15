import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

 
const MiscellaneousArt = () => {
    console.log("MiscellaneousArt")
 
    const [artwork, setArtwork] = useState([])

 
     useEffect(()=>{
         const fetchArtwork = async ()=>{
             try{
                 const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/artworks/collection/${null}`);
                 setArtwork(res.data)
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