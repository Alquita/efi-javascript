import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from "react-toastify"
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"

const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es obligatorio")
})


const CategoryForm = () => {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)

    const { id } = useParams()
    const [category, setCategory] = useState([])
    const editIndex = Number.isInteger(parseInt(id)) ? parseInt(id) : null

    useEffect(() => {
        if (editIndex !== null) {
            try {
                fetch('http://127.0.0.1:5000/api/categories')
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setCategory(data[editIndex])
                    })
                    .catch((error) => { console.error('Error al cargar las categorias', error) })

            } catch (error) {
                console.error('Error al cargar las categorias', error);
            } finally {

            }
        }
    }, [editIndex])

    const handleSubmit = async (values, { resetForm }) => {
        try {
            var res = {}
            if (editIndex !== null && category) {
                res = await fetch(`http://localhost:5000/api/categories/${category.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(values)
                })
            } else {
                res = await fetch('http://localhost:5000/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(values)
                })
            }

            if (res.ok) {
                if (editIndex !== null) {
                    toast.success('Categoria editada con exito')
                } else {
                    toast.success('Categoria creada con exito')
                    resetForm()
                }
                setTimeout(() => navigate('/categories'), 2000)
            } else {
                if (editIndex !== null) {
                    toast.error('Hubo un error al editar la categoria')
                } else {
                    toast.error('Hubo un error al crear la categoria')
                }
            }
        } catch (error) {
            toast.error('Hubo un error con el servidor')
            console.error('Hubo un error con el servidor', error)
        }
    }

    return (
        <Fragment>
            <Navbar />
            <Card title='Crear categoría'>
                <Formik
                    enableReinitialize
                    initialValues={(editIndex !== null && category.name) ?
                        { name: category.name } :
                        { name: '' }
                    }
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div>
                                <label>Nombre</label>
                                <Field as={InputText} id='name' name='name' className='w-full' />
                                <ErrorMessage name="name" component='small' className="p-error block mt-1" />
                            </div>
                            <Button
                                type="submit"
                                label={editIndex !== null ? 
                                    isSubmitting ? 'Editando...' : 'Editar' :
                                    isSubmitting ? 'Creando...' : 'Crear'
                                }
                                disabled={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </Fragment>
    )
}

export default CategoryForm
