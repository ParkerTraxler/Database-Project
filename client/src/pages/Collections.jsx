import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./Collections.css"

const Collections = () => {
    console.log("Collections")

    const [collections, setCollections] = useState([])

    useEffect(()=>{
        const fetchAllCollections = async ()=>{
            try{
                const res = await axios.get("https://mfa-backend-chh3dph8gjbtd2h5.canadacentral-01.azurewebsites.net/collections")
                console.log(res.data)
                setCollections(res.data)
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchAllCollections()
    },[])


    return(
        <div>
            <div className="collectionsBanner">
                <h1>Collections</h1>
            </div>
            <div>
                <h1>Collections</h1>
                    <div className="collectionsC">
                    {collections.map(collection=>(
                        <div className="collectionC" key={collection.Title}>
                            {collection.CollectPic && 
                                <Link to={`/collection-art/${collection.Title}`}>
                                    <img src={collection.CollectPic} alt="" />
                                </Link>
                            }
                            <h2>{collection.Title}</h2>
                            <p>{collection.CollectDesc}</p>
                            
                        </div>
                    ))}
                    <div className="collectionC">
                        <Link to={"/miscellaneous-artwork"}>
                            <img src="./src/assets/NoCollectionOrExhibit.jpeg" alt="" />
                        </Link>
                            
                        <h2>Miscellaneous Art</h2>
                        <p>Artwork not contained in any collection</p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Collections