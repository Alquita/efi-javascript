import { Fragment, useContext } from "react"
import Navbar from "../../components/navbar"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from './AuthContext'


const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria')
})

const Login = () => {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleSubmit = async (values, { setSubmitting }) => {
        const success = await login(values.email, values.password)
        if (success) {
            setTimeout(() => navigate('/'), 1500)
        }
        setSubmitting(false)
    }

    return (
        <Fragment>
            <Navbar />
            <div className='flex align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className='surface-card p-4 shadow-2 border-round w-full lg:w-4'>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className='mb-3'>
                                    <label>Email</label>
                                    <Field as={InputText} id='email' name='email' className='w-full' />
                                    <ErrorMessage name='email' component='small' className='p-error block mt-1' />
                                </div>
                                <div className='mb-4'>
                                    <label>Contraseña</label>
                                    <Field as={Password} id='password' name='password' className='w-full' toggleMask feedback={false} />
                                    <ErrorMessage name='password' component='small' className='p-error block mt-1' />
                                </div>
                                <Button 
                                    type='submit' 
                                    label={isSubmitting ? "Ingresando..." : 'Ingresar'} 
                                    className='w-full mb-3' 
                                    disabled={isSubmitting} 
                                />
                                <div className='text-center'>
                                    <Link to="/register">¿No tenés cuenta? Registrate</Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Fragment>
    )
}

export default Login