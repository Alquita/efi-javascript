import { Fragment, useContext } from "react"
import { useNavigate } from "react-router-dom"
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

    const handleSubmit = async (values, {resetForm}) => {
        try {
            const res = await fetch('http://localhost:5000/api/categories',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            })

            if (res.ok) {
                toast.success('Categoria creada con exito')
                resetForm()
                setTimeout(() => navigate('/categories'), 2000)
            } else {
                toast.error('Hubo un error al crear la categoria')
            }
        } catch (error) {
            toast.error('Hubo un error con el servidor')
            console.error('Hubo un error con el servidor', error)
        }
    }

    return (
        <Fragment>
            <Navbar/>
            <Card title='Crear categoría'>
                <Formik
                    initialValues={{name: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <div>
                                <label>Nombre</label>
                                <Field as={InputText} id='name' name='name' className='w-full' />
                                <ErrorMessage name="name" component='small' className="p-error block mt-1" />
                            </div>
                            <Button
                                type="submit"
                                label={isSubmitting ? 'Creando...' : 'Crear'}
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
