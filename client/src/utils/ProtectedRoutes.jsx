import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.js";

const ProtectedRoutes = () => {
    const { user, isLoggingOut } = useAuth(); //remove isLoggingOut
    const [loading, setLoading] = useState(true);  // Track loading state
    const role = user?.role;
    const hasAlerted = useRef(false);
    

    useEffect(() => {
        if (user === null) {
            setLoading(false);  // Set loading to false if no user is logged in
            if (!loading && !hasAlerted.current && !isLoggingOut) {
                alert("You must log in to a customer account to see this page");
                hasAlerted.current = true;  // Prevents further alerts
            }
        } 
        else if (user) {
            setLoading(false);  // Set loading to false once user is available
        }
    }, [user, loading, isLoggingOut]);
    

    if (loading) {
        return <div>Loading...</div>;  // Render loading state if user is being fetched
    }
    
    if (!user){
        return <Navigate to="/log-in"/>
    }
    else if(role === 'employee' || role === 'manager'){
        return <Navigate to="/"/>
    }

    return role === 'customer' ? <Outlet /> : <Navigate to="/log-in" />;
};

export default ProtectedRoutes