import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
 
const ExhibitCollections = () => {
    console.log("ExhibitCollections")
    const [collections, setCollections] = useState([])
    const location = useLocation()
     
    const ExhibitID = location.pathname.split("/")[2]

    useEffect(()=>{
        const fetchCollections = async ()=>{
            console.log("ID: " + ExhibitID)
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/collections/exhibit/${ExhibitID}`);
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
            <h1>Exhibit Collections</h1>
            <div className="collectionsC">
                {collections.map(collection=>(
                    <div className="collectionC" key={collection.Title}>
                        {collection.CollectPic && 
                            <Link to={`/collection-art/${collection.Title}`}>
                                <img src={collection.CollectPic} alt="" />
                            </Link>
                        }
                        <Link to={`/collection-art/${collection.Title}`}>
                            <h2>{collection.Title}</h2>
                        </Link>
                        <p>{collection.CollectDesc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
 
export default ExhibitCollections