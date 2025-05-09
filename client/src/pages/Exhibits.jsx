import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import imageSrc from '../assets/NoCollectionOrExhibit.jpeg';
import "./Exhibits.css"

const Exhibits = () => {
    console.log("Exhibits")

    const [exhibits, setExhibits] = useState([])
    const [specialExhibits, setSpecialExhibits] = useState([]);
    

    useEffect(()=>{
        const fetchAllExhibits = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/exhibits`)
                console.log(res.data)
                const regularExhibits = res.data.filter(exhibit => exhibit.IsSpecial !== 1);
                const specialExhibits = res.data.filter(exhibit => exhibit.IsSpecial === 1);

                setExhibits(regularExhibits);
                setSpecialExhibits(specialExhibits);
            }catch(err){
                window.alert(err.response.data.error);
            }
        }
        fetchAllExhibits()
    },[])


    return(
        <div>
            <div className="exhibitsBanner">
                <h1>Exhibits</h1>
            </div>
            <div>
                <h1>Regular Exhibits</h1>
                <div className="exhibitsC">
                {exhibits.map(exhibit=>(
                    <div className="exhibitC" key={exhibit.ExhibitID}>
                        {exhibit.ExhibitPic && 
                                <Link to={`/exhibit-collections/${exhibit.ExhibitID}`}>
                                    <img src={exhibit.ExhibitPic} alt="" />
                                </Link>
                        }
                        <Link to={`/exhibit-collections/${exhibit.ExhibitID}`}>
                            <h2>{exhibit.ExhibitName}</h2>
                        </Link>
                        <p>{exhibit.ExhibitDesc}</p>
                        
                    </div>
                ))}
                </div>

                <h1>Special Exhibits</h1>
                <div className="specialExhibitsC">
                {specialExhibits.map(specialExhibit=>(
                    <div className="exhibitC" key={specialExhibit.ExhibitID}>
                        {specialExhibit.ExhibitPic && 
                            <Link to={`/exhibit-collections/${specialExhibit.ExhibitID}`}>
                                <img src={specialExhibit.ExhibitPic} alt="" />
                            </Link>
                        }
                        <Link to={`/exhibit-collections/${specialExhibit.ExhibitID}`}>
                            <h2>{specialExhibit.ExhibitName}</h2>
                        </Link>
                        <div>Start Date: {specialExhibit.StartDate ? new Date(specialExhibit.StartDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "Not provided"}</div>
                        <div>End Date: {specialExhibit.EndDate ? new Date(specialExhibit.EndDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "Not provided"}</div>
                        <div>Fee: {specialExhibit.Fee ? ("$" + specialExhibit.Fee)  : "None"}</div>
                        <p>{specialExhibit.ExhibitDesc}</p>
                        
                    </div>
                ))}
                </div>
                <div className="exhibitC">
                    <Link to={"/miscellaneous-collections"}>
                        <img src={imageSrc} alt="" />
                    </Link>
                                            
                    <h2>Miscellaneous Collections</h2>
                    <p>Collections not contained in any exhibit</p>
                </div>
            </div>
        </div>  
        
    )
}

export default Exhibits