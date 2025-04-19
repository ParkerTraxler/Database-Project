import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

 
const MiscellaneousCollections = () => {
    console.log("MiscellaneousCollections")
    const [collections, setCollections] = useState([])

    useEffect(()=>{
        const fetchCollections = async ()=>{
            
            try{
                const res = await axios.get(`${process.env.REACT_APP_API}/collections/exhibit/${null}`);
                console.log(res.data)
                setCollections(res.data)
                console.log(collections.data)
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchCollections()
    },[])
     
 
    return(
        <div>
            <h1>Miscellaneous Collections</h1>
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
    )
}
 
export default MiscellaneousCollections