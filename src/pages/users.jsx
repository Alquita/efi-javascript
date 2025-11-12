import { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext } from './auth/AuthContext'
import { toast } from 'react-toastify'
import Navbar from '../components/navbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Tag } from 'primereact/tag'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

const Users = () => {
    const { token, user } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const [newRole, setNewRole] = useState('')

    const roleOptions = [
        { label: 'Usuario', value: 'user' },
        { label: 'Moderador', value: 'moderator' },
        { label: 'Administrador', value: 'admin' }
    ]

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                toast.error('Error al cargar usuarios')
                return
            }

            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al conectar con el servidor')
        } finally {
            setLoading(false)
        }
    }

    const handleChangeRole = (user) => {
        setSelectedUser(user)
        setNewRole(user.role)
        setShowRoleDialog(true)
    }

    const confirmChangeRole = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}/role`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            })

            if (!response.ok) {
                toast.error('Error al cambiar el rol')
                return
            }

            toast.success('Rol actualizado correctamente')
            setShowRoleDialog(false)
            fetchUsers()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al conectar con el servidor')
        }
    }

    const handleDeleteUser = (user) => {
        confirmDialog({
            message: `¿Está seguro de desactivar al usuario ${user.username}?`,
            header: 'Confirmar desactivación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteUser(user.id),
            reject: () => {},
            acceptLabel: 'Sí, desactivar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger'
        })
    }

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                toast.error('Error al desactivar usuario')
                return
            }

            toast.success('Usuario desactivado correctamente')
            fetchUsers()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al conectar con el servidor')
        }
    }

    const roleBodyTemplate = (rowData) => {
        const getSeverity = (role) => {
            switch (role) {
                case 'admin': return 'danger'
                case 'moderator': return 'warning'
                case 'user': return 'info'
                default: return null
            }
        }

        const getRoleLabel = (role) => {
            switch (role) {
                case 'admin': return 'Administrador'
                case 'moderator': return 'Moderador'
                case 'user': return 'Usuario'
                default: return role
            }
        }

        return <Tag value={getRoleLabel(rowData.role)} severity={getSeverity(rowData.role)} />
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.is_active ? 'Activo' : 'Inactivo'} 
                severity={rowData.is_active ? 'success' : 'danger'} 
            />
        )
    }

    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.created_at).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const actionsBodyTemplate = (rowData) => {
        const isCurrentUser = user?.sub === rowData.id

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-user-edit"
                    rounded
                    text
                    severity="info"
                    tooltip="Cambiar rol"
                    onClick={() => handleChangeRole(rowData)}
                    disabled={isCurrentUser || !rowData.is_active}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    tooltip="Desactivar usuario"
                    onClick={() => handleDeleteUser(rowData)}
                    disabled={isCurrentUser || !rowData.is_active}
                />
            </div>
        )
    }

    if (user?.role !== 'admin') {
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

    return (
        <Fragment>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
                    <p className="text-gray-400">Administra los usuarios y sus roles en el sistema</p>
                </div>

                <div className="card">
                    <DataTable
                        value={users}
                        loading={loading}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        emptyMessage="No se encontraron usuarios"
                        className="p-datatable-sm"
                    >
                        <Column field="id" header="ID" sortable style={{ width: '5%' }} />
                        <Column field="username" header="Usuario" sortable style={{ width: '15%' }} />
                        <Column field="email" header="Email" sortable style={{ width: '20%' }} />
                        <Column 
                            field="role" 
                            header="Rol" 
                            body={roleBodyTemplate} 
                            sortable 
                            style={{ width: '12%' }} 
                        />
                        <Column 
                            field="is_active" 
                            header="Estado" 
                            body={statusBodyTemplate} 
                            sortable 
                            style={{ width: '10%' }} 
                        />
                        <Column 
                            field="created_at" 
                            header="Fecha de Registro" 
                            body={dateBodyTemplate} 
                            sortable 
                            style={{ width: '18%' }} 
                        />
                        <Column
                            header="Acciones"
                            body={actionsBodyTemplate}
                            style={{ width: '12%' }}
                        />
                    </DataTable>
                </div>
            </div>

            <Dialog
                header="Cambiar Rol de Usuario"
                visible={showRoleDialog}
                style={{ width: '450px' }}
                onHide={() => setShowRoleDialog(false)}
                footer={
                    <div>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setShowRoleDialog(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={confirmChangeRole}
                            autoFocus
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="mb-2">Usuario: <strong>{selectedUser?.username}</strong></p>
                        <p className="mb-4 text-gray-400">Email: {selectedUser?.email}</p>
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Nuevo Rol</label>
                        <Dropdown
                            value={newRole}
                            onChange={(e) => setNewRole(e.value)}
                            options={roleOptions}
                            placeholder="Selecciona un rol"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog />
        </Fragment>
    )
}

export default Users