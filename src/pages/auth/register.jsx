import { Fragment } from "react"
import Navbar from "../../components/navbar"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
    username: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email invalido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
    role: Yup.string().required('El rol es obligatorio')
})

const Register = () => {
    const navigate = useNavigate()

    const roles = [
        { label: 'Usuario', value: 'user' },
        { label: 'Admin', value: 'admin' },
        { label: 'Moderador', value: 'moderator' }
    ]

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })
            if (response.ok) {
                toast.success("Usuario registrado con exito")
                resetForm()
                setTimeout(() => navigate('/login'), 2000)
            } else {
                toast.error("Hubo un error al registrar el usuario")
            }
        } catch (error) {
            toast.error("Hubo un error con el servidor")
        }
    }

    return (
        <Fragment>
            <Navbar />
            <div className='flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className='surface-card p-4 shadow-2 border-round w-full lg:w-4'>
                    <h2 className="text-center mb-4">Crear cuenta</h2>
                    <Formik
                        initialValues={{ username: '', email: '', password: '', role: 'user' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form>
                                <div className='mb-3'>
                                    <label>Nombre</label>
                                    <Field as={InputText} id='username' name='username' className='w-full' />
                                    <ErrorMessage name='username' component='small' className='p-error block mt-1' />
                                </div>
                                <div className='mb-3'>
                                    <label>Email</label>
                                    <Field as={InputText} id='email' name='email' className='w-full' />
                                    <ErrorMessage name='email' component='small' className='p-error block mt-1' />
                                </div>
                                <div className='mb-3'>
                                    <label>Contraseña</label>
                                    <Field as={InputText} type='password' id='password' name='password' className='w-full' />
                                    <ErrorMessage name='password' component='small' className='p-error block mt-1' />
                                </div>
                                <div className='mb-4'>
                                    <label>Rol</label>
                                    <Dropdown 
                                        value={values.role} 
                                        options={roles} 
                                        onChange={(e) => setFieldValue('role', e.value)}
                                        placeholder="Selecciona un rol"
                                        className='w-full'
                                    />
                                    <ErrorMessage name='role' component='small' className='p-error block mt-1' />
                                </div>
                                <Button 
                                    type='submit' 
                                    label={isSubmitting ? "Registrando..." : 'Registrarse'} 
                                    disabled={isSubmitting} 
                                    className='w-full'
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Fragment>
    )
}

export default Register