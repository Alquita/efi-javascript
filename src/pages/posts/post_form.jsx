import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from "react-toastify"
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"

const validationSchema = Yup.object({
    title: Yup.string().required("El título es obligatorio"),
    content: Yup.string().required("El contenido es obligatorio"),
    category_id: Yup.string().required("La categoría es obligatoria")
})


const PostForm = () => {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)

    const { id } = useParams()
    const [post, setPost] = useState([])
    const editIndex = Number.isInteger(parseInt(id)) ? parseInt(id) : null

    const categories = [
        {label: 'A', value: '1'}
    ]

    useEffect(() => {
        if (editIndex !== null) {
            try {
                fetch(`http://127.0.0.1:5000/api/posts/${id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setPost(data)
                    })
                    .catch((error) => { console.error('Error al cargar las publicaciones', error) })

            } catch (error) {
                console.error('Error al cargar las publicaciones', error);
            }
        }
    }, [editIndex])

    const handleSubmit = async (values, { resetForm }) => {
        try {
            var res = {}
            if (editIndex !== null && post) {
                res = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(values)
                })
            } else {
                res = await fetch('http://localhost:5000/api/posts', {
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
                    toast.success('Publicacion editada con exito')
                } else {
                    toast.success('Publicacion creada con exito')
                    resetForm()
                }
                setTimeout(() => navigate('/posts'), 2000)
            } else {
                if (editIndex !== null) {
                    toast.error('Hubo un error al editar la publicacion')
                } else {
                    console.log(JSON.stringify(values));
                    
                    toast.error('Hubo un error al crear la publicacion')
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
            <Card title='Crear pulbicación'>
                <Formik
                    enableReinitialize
                    initialValues={(editIndex !== null && post.title) ?
                        {
                            title: post.title,
                            content: post.content,
                            category_id: post.category_id,
                        } :
                        {
                            title: '',
                            content: '',
                            category_id: '',
                        }
                    }
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className="flex flex-column gap-3">
                            <div>
                                <label>Título</label>
                                <Field as={InputText} id='title' name='title' className='w-full' />
                                <ErrorMessage name="title" component='small' className="p-error block mt-1" />
                            </div>
                            <div>
                                <label>Contenido</label>
                                <Field as={InputText} id='content' name='content' className='w-full' />
                                <ErrorMessage name="content" component='small' className="p-error block mt-1" />
                            </div>
                            <div>
                                <label>Categoría</label>
                                <Dropdown 
                                    value={values.category_id} 
                                    options={categories} 
                                    onChange={(e) => setFieldValue('category_id', e.value)}
                                    placeholder="Seleccione una categoría"
                                    className='w-full'
                                />
                                <ErrorMessage name="category_id" component='small' className="p-error block mt-1" />
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

export default PostForm
