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
                const res = await axios.get("http://localhost:3002/collections")
                console.log(res.data)
                setCollections(res.data)
            }catch(err){
                console.log(err)
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
                </div>
            </div>
        </div>
    )
}

export default Collections