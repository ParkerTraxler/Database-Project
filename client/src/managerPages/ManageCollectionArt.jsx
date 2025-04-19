import React from 'react'
 import ManagerNav from './ManagerNav'
 import { useState, useEffect } from 'react'
 import axios from 'axios'
 import { Link } from 'react-router-dom'
 import { useNavigate } from 'react-router-dom'
 import { useLocation } from 'react-router-dom'
 import { useAuth } from '../utils/AuthContext'
 import './ManagerDashboard.css'
 
 const ManageCollectionArt = () => {
     console.log("ManageCollectionArt")
 
     const [artwork, setArtwork] = useState([])
     const { user } = useAuth()
     const token = user.token
     console.log("token: " + token)
 
     const navigate = useNavigate()
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
 
     const handleDelete = async (artID)=>{
         console.log("ID: " + artID)
         try{
             const res = await axios.delete("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/artworks/", {
                 headers: {
                     'authorization': `Bearer ${token}`
                 },
                 data: {artID: artID}
             })
             console.log(res.data)
             window.location.reload() //refreshes the page
         }
         catch(err){
            window.alert(err.response.data.error);
         }
     }
 
     return(
         
 
         
         <div className="managerView">
             <div>
                 <ManagerNav/>
             </div>
             <div>
                 <h1>{collectionTitle}</h1>
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
                         <div>
                             <button className="delete" onClick={()=>handleDelete(art.ArtID)}>Delete</button>
                         </div>
                         <div>
                             <button className="update"><Link to={`/edit-artwork/${art.ArtID}`}>Update</Link></button>
                         </div>
                         
                     </div>
                 ))}
                 </div>
                 <button>
                     <Link to={`/add-artwork/${collectionTitle}`}>Add Artwork</Link>
                 </button>
             </div>
             
         </div>
     )
 }
 
 export default ManageCollectionArt