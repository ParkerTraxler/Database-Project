import React from 'react'
import ManagerNav from './ManagerNav'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './ManagerDashboard.css'

const ViewDonations = () => {
    console.log("ViewDonations")
    const [donations, setDonations] = useState([])

    useEffect(()=>{
        const fetchAllDonations = async ()=>{
            try{
                const res = await axios.get("https://green-ground-0dc4ce31e.6.azurestaticapps.net/donations")
                console.log(res.data)
                setDonations(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchAllDonations()
    },[])

    return(
        
        
        <div className="managerView">
            <div>
                <ManagerNav/>
            </div>
            <div>
            <h1>Donations</h1>
                <table>
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
                            <td>{new Date(donation.DonateDate).toLocaleDateString()}</td>
                            <td>{donation.DonateAmt}</td>
                            <td>{donation.DonateDesc}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
                
                </div>
            </div>
            
        
    )
}

export default ViewDonations