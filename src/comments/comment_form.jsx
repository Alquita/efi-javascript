import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "primereact/card"
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from "react-toastify"
import { AuthContext } from "../pages/auth/AuthContext"

const validationSchema = Yup.object({
    text: Yup.string().required("El contenido es obligatorio"),
})


const CommentForm = () => {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)

    const { id } = useParams()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            var res = {}
            res = await fetch(`http://localhost:5000/api/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            })

            if (res.ok) {
                toast.success('Comentario creado con exito')
                resetForm()

                setTimeout(() => navigate(0), 2000)
            } else {
                console.log(JSON.stringify(values));
                
                toast.error('Hubo un error al crear el comentario')
            }
        } catch (error) {
            toast.error('Hubo un error con el servidor')
            console.error('Hubo un error con el servidor', error)
        }
    }

    return (
        <Fragment>
            <Card>
                <Formik
                    enableReinitialize
                    initialValues={{text: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex gap-3">
                            <div className="flex flex-column flex-grow-1">
                                <Field as={InputTextarea} id='text' name='text' className='w-full' />
                                <ErrorMessage name="text" component='small' className="p-error block mt-1" />
                            </div>
                            <Button
                                type="submit"
                                label={isSubmitting ? 'Comentando...' : 'Comentar'}
                                disabled={isSubmitting}
                                className="h-full"
                                icon='pi pi-comment'
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </Fragment>
    )
}

export default CommentForm
