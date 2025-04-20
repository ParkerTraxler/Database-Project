import React from 'react'
import ManagerDashboard from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import './ManagerDashboard.css'
import './ManageExhibits.css'

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
        <div className="manage-exhibits-container">
        <div className="managerView">
            <div>
                <ManagerDashboard/>
            </div>
            <div className="manage-exhibits-section">
                <h1 className="manage-exhibits-header">Exhibits</h1>
                <div className="exhibitsM">
                {exhibits.map(exhibit=>(
                    <div className="exhibitM" key={exhibit.ExhibitID}>
                        {exhibit.ExhibitPic && <img src={exhibit.ExhibitPic} alt="" />}
                        <h2>{exhibit.ExhibitName}</h2>
                        <p>{exhibit.ExhibitDesc}</p>
                        <p>ID: {exhibit.ExhibitID}</p>
                        <button className="update"><Link to={`/edit-exhibit/${exhibit.ExhibitID}`}>Update</Link></button>
                    </div>
                ))}
                </div>
                <button className="create-exhibit-button">
                    <Link to="/add-exhibit">Create Exhibit</Link>
                </button>

                <div className="specialExhibitsM">
                {specialExhibits.map(specialExhibit=>(
                    <div className="exhibitM" key={specialExhibit.ExhibitID}>
                        {specialExhibit.ExhibitPic && <img src={specialExhibit.ExhibitPic} alt="" />}
                        <h2>{specialExhibit.ExhibitName}</h2>
                        <div>Start Date: {specialExhibit.StartDate ? new Date(specialExhibit.StartDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "Not provided"}</div>
                        <div>End Date: {specialExhibit.EndDate ? new Date(specialExhibit.EndDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "Not provided"}</div>
                        <div>Fee: {specialExhibit.Fee ? ("$" + specialExhibit.Fee)  : "None"}</div>
                        <p>{specialExhibit.ExhibitDesc}</p>
                        <button className="update"><Link to={`/edit-special-exhibit/${specialExhibit.ExhibitID}`}>Update</Link></button>
                    </div>
                ))}
                </div>
                <button className="add-special-exhibit-button">
                    <Link to="/add-special-exhibit">Create Special Exhibit</Link>
                </button>
            </div>
        </div>
        </div>
        
    )
}

export default ManageExhibits