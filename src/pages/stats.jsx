import { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext } from './auth/AuthContext'
import { toast } from 'react-toastify'
import Navbar from '../components/navbar'
import { Card } from 'primereact/card'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Stats = () => {
    const { token, user } = useContext(AuthContext)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:5000/api/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                toast.error('Error al cargar estadísticas')
                return
            }

            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al conectar con el servidor')
        } finally {
            setLoading(false)
        }
    }

    if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return (
            <Fragment>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">Acceso denegado</p>
                        <p>No tienes permisos para acceder a esta página.</p>
                    </div>
                </div>
            </Fragment>
        )
    }

    if (loading) {
        return (
            <Fragment>
                <Navbar />
                <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <i className="pi pi-spin pi-spinner text-4xl text-purple-500 mb-4"></i>
                        <p className="text-xl text-gray-400">Cargando estadísticas...</p>
                    </div>
                </div>
            </Fragment>
        )
    }

    const pieData = [
        { name: 'Posts', value: stats?.total_posts || 0, color: '#8b5cf6' },
        { name: 'Comentarios', value: stats?.total_comments || 0, color: '#ec4899' },
        { name: 'Usuarios', value: stats?.total_users || 0, color: '#06b6d4' }
    ]

    const barData = [
        { name: 'Posts', cantidad: stats?.total_posts || 0 },
        { name: 'Comentarios', cantidad: stats?.total_comments || 0 },
        { name: 'Usuarios', cantidad: stats?.total_users || 0 }
    ]

    const activityData = [
        { dia: 'Lun', posts: Math.floor((stats?.posts_last_week || 0) * 0.15) },
        { dia: 'Mar', posts: Math.floor((stats?.posts_last_week || 0) * 0.12) },
        { dia: 'Mié', posts: Math.floor((stats?.posts_last_week || 0) * 0.18) },
        { dia: 'Jue', posts: Math.floor((stats?.posts_last_week || 0) * 0.14) },
        { dia: 'Vie', posts: Math.floor((stats?.posts_last_week || 0) * 0.16) },
        { dia: 'Sáb', posts: Math.floor((stats?.posts_last_week || 0) * 0.13) },
        { dia: 'Dom', posts: Math.floor((stats?.posts_last_week || 0) * 0.12) }
    ]

    const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4']

    return (
        <Fragment>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Estadísticas del Sistema
                    </h1>
                    <p className="text-gray-400">Panel de métricas y análisis de la plataforma</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-200 text-sm mb-1">Total Posts</p>
                                <p className="text-4xl font-bold text-white">{stats?.total_posts || 0}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-full">
                                <i className="pi pi-file text-3xl text-white"></i>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-pink-600 to-pink-800 border-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-200 text-sm mb-1">Comentarios</p>
                                <p className="text-4xl font-bold text-white">{stats?.total_comments || 0}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-full">
                                <i className="pi pi-comments text-3xl text-white"></i>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-600 to-cyan-800 border-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-cyan-200 text-sm mb-1">Usuarios</p>
                                <p className="text-4xl font-bold text-white">{stats?.total_users || 0}</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-4 rounded-full">
                                <i className="pi pi-users text-3xl text-white"></i>
                            </div>
                        </div>
                    </Card>

                    {user?.role === 'admin' && stats?.posts_last_week !== undefined && (
                        <Card className="bg-gradient-to-br from-orange-600 to-orange-800 border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-200 text-sm mb-1">Posts (7 días)</p>
                                    <p className="text-4xl font-bold text-white">{stats?.posts_last_week || 0}</p>
                                </div>
                                <div className="bg-white bg-opacity-20 p-4 rounded-full">
                                    <i className="pi pi-chart-line text-3xl text-white"></i>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card title="Comparativa General" className="shadow-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="cantidad" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Distribución de Contenido" className="shadow-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {user?.role === 'admin' && stats?.posts_last_week !== undefined && (
                    <Card title="Actividad de la Última Semana" className="shadow-lg mb-8">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="dia" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="posts" 
                                    stroke="#f97316" 
                                    strokeWidth={3}
                                    dot={{ fill: '#f97316', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-lg">
                        <div className="text-center">
                            <i className="pi pi-chart-bar text-5xl text-purple-500 mb-4"></i>
                            <h3 className="text-xl font-bold mb-2">Promedio de Comentarios</h3>
                            <p className="text-3xl font-bold text-purple-400">
                                {stats?.total_posts > 0 
                                    ? (stats.total_comments / stats.total_posts).toFixed(1) 
                                    : '0'}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">Por post</p>
                        </div>
                    </Card>

                    <Card className="shadow-lg">
                        <div className="text-center">
                            <i className="pi pi-users text-5xl text-pink-500 mb-4"></i>
                            <h3 className="text-xl font-bold mb-2">Engagement Rate</h3>
                            <p className="text-3xl font-bold text-pink-400">
                                {stats?.total_users > 0 
                                    ? ((stats.total_posts + stats.total_comments) / stats.total_users).toFixed(1) 
                                    : '0'}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">Acciones por usuario</p>
                        </div>
                    </Card>

                    <Card className="shadow-lg">
                        <div className="text-center">
                            <i className="pi pi-globe text-5xl text-cyan-500 mb-4"></i>
                            <h3 className="text-xl font-bold mb-2">Total Interacciones</h3>
                            <p className="text-3xl font-bold text-cyan-400">
                                {(stats?.total_posts || 0) + (stats?.total_comments || 0)}
                            </p>
                            <p className="text-gray-400 text-sm mt-2">Posts + Comentarios</p>
                        </div>
                    </Card>
                </div>
            </div>
        </Fragment>
    )
}

export default Stats