import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken)
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded)
                    setToken(storedToken)
                } else {
                    localStorage.removeItem("token")
                }
            } catch (error) {
                console.error("token invalido", error)
                localStorage.removeItem("token")
            }
        }
    }, [])

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            
            if (!response.ok) {
                toast.error("Credenciales incorrectas")
                return false
            }

            const data = await response.json()
            console.log("Respuesta del servidor:", data) 
            const jwtToken = data.access_token || data.token
            
            if (!jwtToken) {
                toast.error("No se recibio el token")
                return false
            }

            localStorage.setItem('token', jwtToken)
            const decoded = jwtDecode(jwtToken)
            setUser(decoded)
            setToken(jwtToken)
            toast.success('Inicio de sesion exitoso')
            return true
        } catch (error) {
            console.error("Error en login:", error)
            toast.error("Hubo un error al iniciar sesion")
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
        toast.info('Sesión cerrada')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
