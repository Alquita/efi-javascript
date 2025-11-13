import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { AuthContext } from '../pages/auth/AuthContext'

const Navbar = () => {
    const navigate = useNavigate()
    const { user, logout } = useContext(AuthContext)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const publicItems = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => { navigate('/') }
        },
        {
            label: 'Posts',
            icon: 'pi pi-pen-to-square',
            items: [
                {
                    label: 'Ver Posts',
                    icon: 'pi pi-list',
                    command: () => { navigate('/posts') }
                },
                ...(user ? [{
                    label: 'Crear Post',
                    icon: 'pi pi-plus',
                    command: () => { navigate('/posts/new') }
                }] : [])
            ]
        },
        {
            label: 'Categorías',
            icon: 'pi pi-tags',
            command: () => { navigate('/categories') }
        }
    ]

    const moderatorItems = (user?.role === 'moderator' || user?.role === 'admin') ? [
        {
            label: 'Gestión',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Crear Categoría',
                    icon: 'pi pi-plus',
                    command: () => { navigate('/categories/new') }
                },
                {
                    label: 'Estadísticas',
                    icon: 'pi pi-chart-bar',
                    command: () => { navigate('/stats') }
                }
            ]
        }
    ] : []

    const adminItems = user?.role === 'admin' ? [
        {
            label: 'Administración',
            icon: 'pi pi-shield',
            items: [
                {
                    label: 'Gestionar Usuarios',
                    icon: 'pi pi-users',
                    command: () => { navigate('/users') }
                }
            ]
        }
    ] : []

    const items = [...publicItems, ...moderatorItems, ...adminItems]

    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { label: 'Admin', color: '#ef4444' },
            moderator: { label: 'Moderador', color: '#f59e0b' },
            user: { label: 'Usuario', color: '#10b981' }
        }
        const config = roleConfig[role] || roleConfig.user
        
        return (
            <span style={{
                backgroundColor: config.color,
                color: 'white',
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                marginLeft: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase'
            }}>
                {config.label}
            </span>
        )
    }
    const end = user ? (
        <div className="flex align-items-center gap-3">
            <span style={{ color: 'white', fontWeight: '500' }}>
                👋 Hola, <strong>{user.username}</strong>
                {getRoleBadge(user.role)}
            </span>
            <Button
                onClick={handleLogout}
                label="Cerrar Sesión"
                icon='pi pi-sign-out'
                iconPos='right'
                severity="danger"
                outlined
            />
        </div>
    ) : (
        <div className="flex gap-2">
            <Button
                onClick={() => navigate('/login')}
                label="Login"
                icon='pi pi-sign-in'
                iconPos='right'
                outlined
            />
            <Button
                onClick={() => navigate('/register')}
                label="Register"
                icon='pi pi-user-plus'
                iconPos='right'
            />
        </div>
    )

    return (
        <Menubar model={items} end={end} />
    )
}

export default Navbar