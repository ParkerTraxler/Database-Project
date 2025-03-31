import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "./Exhibits.css"

const Exhibits = () => {
    console.log("Exhibits")

    const [exhibits, setExhibits] = useState([])
    const [specialExhibits, setSpecialExhibits] = useState([]);
    

    useEffect(()=>{
        const fetchAllExhibits = async ()=>{
            try{
                const res = await axios.get("http://localhost:3002/exhibits")
                console.log(res.data)
                const regularExhibits = res.data.filter(exhibit => exhibit.IsSpecial !== 1);
                const specialExhibits = res.data.filter(exhibit => exhibit.IsSpecial === 1);

                setExhibits(regularExhibits);
                setSpecialExhibits(specialExhibits);
            }catch(err){
                console.log(err)
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
                        {exhibit.ExhibitPic && <img src={exhibit.ExhibitPic} alt="" />}
                        <h2>{exhibit.ExhibitName}</h2>
                        <p>{exhibit.ExhibitDesc}</p>
                        
                    </div>
                ))}
                </div>

                <h1>Special Exhibits</h1>
                <div className="specialExhibitsC">
                {specialExhibits.map(specialExhibit=>(
                    <div className="exhibitC" key={specialExhibit.ExhibitID}>
                        {specialExhibit.ExhibitPic && <img src={specialExhibit.ExhibitPic} alt="" />}
                        <h2>{specialExhibit.ExhibitName}</h2>
                        <p>{specialExhibit.ExhibitDesc}</p>
                        
                    </div>
                ))}
                </div>
            </div>
        </div>  
        
    )
}

export default Exhibits