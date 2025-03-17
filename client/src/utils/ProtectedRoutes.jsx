import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.js";

const ProtectedRoutes = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);  // Track loading state
    const role = user?.role;
    const hasAlerted = useRef(false);

    useEffect(() => {
        if (user === null) {
            setLoading(false);  // Set loading to false if no user is logged in
        } 
        else if (user) {
            setLoading(false);  // Set loading to false once user is available
        }
    }, [user]);

    useEffect(() => {
        if (role && (role =='manager' || role == 'employee') && !hasAlerted.current){
            alert("Only customers have access to these pages");
            hasAlerted.current = true; // Prevents further alerts
        }
        else if (role && role !== 'customer' && !hasAlerted.current) {
            alert("You are not logged in");
            hasAlerted.current = true; // Prevents further alerts
        }
    }, [role]);

    if (loading) {
        return <div>Loading...</div>;  // Render loading state if user is being fetched
    }
    
    if (!user){
        return <Navigate to="/"/>
    }
    else if(role == 'employee' || role == 'manager'){
        return <Navigate to="/"/>
    }

    return role === 'customer' ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes