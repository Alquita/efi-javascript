import { Fragment, useContext, useEffect, useState } from "react"
import { Card } from 'primereact/card'
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from 'primereact/column'
import { ProgressSpinner } from 'primereact/progressspinner'
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"

const actionsTemplate = (row, opts) => {
    const { user } = useContext(AuthContext)
    const id = opts.rowIndex
    
    return (
        <div>
            <Button icon='pi pi-pencil' />
            { user?.role === 'admin' && <Button icon='pi pi-trash'  /> }
        </div>
    )
}

const Categories = () => {
    const { user } = useContext(AuthContext)

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchCategories = async () => {
        setLoading(true)

        try {
            const res = await fetch('http://127.0.0.1:5000/api/categories')
            if (!res.ok) throw new Error('Hubo un error al cargar las categorias')

            const data = await res.json()
            setCategories(data)
        } catch (error) {
            setError('Error al cargar las categorias')
            console.error(error);
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <Fragment>
            <Navbar/>
            <Card title='Categorías'>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {loading ? <ProgressSpinner/> :
                    <DataTable value={categories} emptyMessage='No hay categorías cargadas'>
                        <Column field="name" header='Nombre'/>
                        { (user?.role === 'moderator' || user?.role === 'admin') &&
                        <Column header='Acciones' body={actionsTemplate} style={{width: '15%'}} />
                        }
                    </DataTable>
                }
            </Card>
        </Fragment>
    )
}

export default Categories
