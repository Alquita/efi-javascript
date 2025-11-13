import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { AuthContext } from '../pages/auth/AuthContext';

export const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(()=>{
        console.log(user);
        
        if (!user) {
            toast.error('Acceso denegado a la ruta')
            navigate('/login')
        } else {
            if (!user.role in allowedRoles) {
                toast.error('Rol no permitido')
                navigate('/login')
            }
        }
    },[])

    return children;
};