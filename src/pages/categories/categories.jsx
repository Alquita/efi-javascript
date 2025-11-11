import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from 'primereact/card'
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import { toast } from "react-toastify"
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"


const Categories = () => {
    const { user, token } = useContext(AuthContext)
    
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const actionsTemplate = (row, opts) => {
        const navigate = useNavigate()
    
        const id = opts.rowIndex
    
        return (
            <div>
                <Button icon='pi pi-pencil' onClick={() => navigate(`/categories/${id}`)} />
                {user?.role === 'admin' &&
                    <Button icon='pi pi-trash' onClick={() => deleteCategory(row.id, token)} />
                }
            </div>
        )
    }

    const deleteCategory = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            if (!res.ok) throw new Error(`Hubo un error al eliminar la categoria ${res.status}`)
    
            fetchCategories()
            toast.success('Categoria eliminada con exito')
        } catch (error) {
            toast.error('Hubo un error al eliminar la categoria')
            console.error('Hubo un error al eliminar la categoria', error);
        }
    }

    const fetchCategories = async () => {
        setLoading(true)

        try {
            const res = await fetch('http://127.0.0.1:5000/api/categories')
            if (!res.ok) throw new Error('Hubo un error al cargar las categorias')

            const data = await res.json()
            setCategories(data)
        } catch (error) {
            console.error('Error al cargar las categorias', error);
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <Fragment>
            <Navbar />
            <Card title='Categorías'>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading ? <ProgressSpinner /> :
                    <DataTable value={categories} emptyMessage='No hay categorías cargadas'>
                        <Column field="name" header='Nombre' />
                        {(user?.role === 'moderator' || user?.role === 'admin') &&
                            <Column header='Acciones' body={actionsTemplate} style={{ width: '15%' }} />
                        }
                    </DataTable>
                }
            </Card>
        </Fragment>
    )
}

export default Categories
