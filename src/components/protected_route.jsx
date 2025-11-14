import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { AuthContext } from '../pages/auth/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(()=>{
        if (!user) {
            toast.error('Acceso denegado a la ruta')
            navigate('/')
        }
    },[])

    return children;
};