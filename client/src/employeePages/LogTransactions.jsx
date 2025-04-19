import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../utils/AuthContext'
import axios from 'axios'
import EmployeeNav from './EmployeeNav'
import './EmployeeDashboard.css'
import './LogTransactions.css'

const LogTransactions = () => {
    console.log("LogTransactions")
    const { user } = useAuth()
    const token = user.token
    console.log(token)

    const [email, setEmail] = useState([])
    const [items, setItems] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchItems = async () => {
            try {
                console.log("GET Sent")
                const res = await axios.get(`${process.env.REACT_APP_API}/items`);
                console.log("GET Completed")
                console.log(res.data)
                setItems(res.data);  // Store the data once fetched
                console.log(items)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);  // Stop loading after request completes
            }
        };
        fetchItems();
    }, []);

    const handleChange = (e, itemID) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity < 0) return;
        setCartItems(prevCart => 
            prevCart.map(item => 
                item.ItemID === itemID ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleEmail = (e) =>{ // given target to given value
        setEmail(prev=>({...prev, [e.target.name]: e.target.value}))
        console.log(email)
    }
    

    const isInCart = (itemID) => cartItems.some(cartItem => cartItem.ItemID === itemID);

    const addItemToCart = (item) => {
        setCartItems(prevCart => [...prevCart, item]);  // append the item to the array
        console.log("Cart updated:", cartItems);
    }

    const removeFromCart = (itemID) => {
        setCartItems(prevCart => prevCart.filter(item => item.ItemID !== itemID));
    };   

    const now = new Date();

    const year = now.getFullYear();            
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');         
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);  

    const handleClick = async e =>{ //do async for api requests
        e.preventDefault()  //prevents page refresh on button click

        console.log(email.email)
        const itemIDs = cartItems.map(item => item.ItemID);
        const quantities = cartItems.map(item => item.quantity || 1); // default to 1 if quantity is not set
        
        console.log(itemIDs)
        console.log(quantities)
        
        try{
            console.log("POST Sent")
            const res = await axios.post(`${process.env.REACT_APP_API}/transactions/items`, {
                itemids: itemIDs, 
                email: email.email, 
                quantities: quantities, 
                datepurchased: formattedDate,
            },
            {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            })
            console.log("POST Completed")
            console.log(res.end)
            
            setCartItems([]);
            window.location.reload();

        }
        catch(err){
            window.alert(err.response.data.error);
        }
    }

    return(
        
        <div className="log-transactions-container">
        <div className="managerView">
            <div>
                <EmployeeNav/>
            </div>
            <div className="transactionContainer-section">
                <h1>Log Transactions</h1>
                <div>
                    {loading ? (
                        <p>Loading items...</p>  // Show a loading message while waiting for data
                    ) : (
                        items.length > 0 ? (
                        items.map(item=>(
                            <div className="itemlogEm" key={item.ItemID}>
                                <div>{item.ItemName}</div>
                                <div>{"$" + item.ItemPrice}</div>
                                <div>Stock: {item.AmountInStock}</div>
                                {item.isPurchasable == '1' && (
                                    <div>
                                        <button disabled={isInCart(item.ItemID)} onClick={() => addItemToCart(item)}>{isInCart(item.ItemID) ? "In Cart" : "Add to Cart"}</button>
                                    </div>
                                )}
                                {item.isPurchasable == '0' && (
                                    <div>Out of Stock.</div>
                                )}
                                
                            </div>
                        ))
                    ) : (
                        <p className="no-items-message">No items currently available.</p>  
                    ))}
                </div> 
                <div>
                    <h2>Cart</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map(cartItem=>(
                            <div className="cartItem" key={cartItem.ItemID}>
                                <div>{cartItem.ItemName}</div>
                                <div>{"$" + cartItem.ItemPrice}</div>
                                <div>
                                    Quantity:
                                    <input className="log-transactions-input-cart" type="number" min="0" placeholder="amount to buy" onChange={(e) => handleChange(e, cartItem.ItemID)} name={"quantity"}/>
                                </div>
                                
                                <div>
                                    <button onClick={() => removeFromCart(cartItem.ItemID)}>Remove from Cart</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-items-message">No items in cart.</p> 
                    )}
                    <div>
                        <input className="log-transactions-input" type="email" placeholder="enter customer's email" onChange={handleEmail} name="email"/>
                    </div>
                    <div>
                        <button className="log-transactions-submit-button" onClick={handleClick}>Log Transaction</button>
                    </div>
                </div>
            </div>
        </div>    
        </div>
    )
}

export default LogTransactions