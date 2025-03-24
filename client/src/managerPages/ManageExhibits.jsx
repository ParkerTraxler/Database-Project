import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './ManagerDashboard.css'

const ManageExhibits = () => {
    console.log("ManageExhibits")

    const [exhibits, setExhibits] = useState([])
    const [specialExhibits, setSpecialExhibits] = useState([]);
    const { user } = useAuth()
    const token = user.token
    console.log("token: " + token)

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
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div>
                Manage Exhibits
                <h1>Exhibits</h1>
                <div className="exhibits">
                {exhibits.map(exhibit=>(
                    <div className="exhibit" key={exhibit.ExhibitID}>
                        {exhibit.ExhibitPic && <img src={exhibit.ExhibitPic} alt="" />}
                        <h2>{exhibit.ExhibitName}</h2>
                        <p>{exhibit.ExhibitDesc}</p>
                        <button className="update"><Link to={`/edit-exhibit/${exhibit.ExhibitID}`}>Update</Link></button>
                    </div>
                ))}
                </div>
                <button>
                    <Link to="/add-exhibit">Create Exhibit</Link>
                </button>

                <div className="specialExhibits">
                {specialExhibits.map(specialExhibit=>(
                    <div className="exhibit" key={specialExhibit.ExhibitID}>
                        {specialExhibit.ExhibitPic && <img src={specialExhibit.ExhibitPic} alt="" />}
                        <h2>{specialExhibit.ExhibitName}</h2>
                        <p>{specialExhibit.ExhibitDesc}</p>
                        <button className="update"><Link to={`/edit-special-exhibit/${specialExhibit.ExhibitID}`}>Update</Link></button>
                    </div>
                ))}
                </div>
                <button>
                    <Link to="/add-special-exhibit">Create Special Exhibit</Link>
                </button>
            </div>
        </div>  
        
    )
}

export default ManageExhibits