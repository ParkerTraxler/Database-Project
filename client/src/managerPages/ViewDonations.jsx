import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './ManagerDashboard.css'
import './ViewDonations.css'

const ViewDonations = () => {
    console.log("ViewDonations")
    const [donations, setDonations] = useState([])

    useEffect(()=>{
        const fetchAllDonations = async ()=>{
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/donations`)
                console.log(res.data)
                setDonations(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchAllDonations()
    },[])

    return(
        
        <div className = "container-view-donations">
            <div className="managerView">
                <div>
                    <ManagerNav/>
                </div>
            <div className = "view-donations-section">
                <h1 className = "view-donations-header">Donations</h1>
                    <table className = "view-donations-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation=>(
                            <tr key={donation.DonationID}>
                                <td>{donation.DonatorName}</td>
                                <td>{donation.DonationID}</td>
                                <td>{new Date(donation.DonateDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                <td>{donation.DonateAmt}</td>
                                <td>{donation.DonateDesc}</td>
                            </tr>
                            ))}
                    </tbody>
                    </table>
                
                </div>
            </div>
        </div>    
        
    )
}

export default ViewDonations