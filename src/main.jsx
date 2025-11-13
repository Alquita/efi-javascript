import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { ToastContainer } from 'react-toastify'
import 'primereact/resources/themes/lara-dark-purple/theme.css'
import 'primeicons/primeicons.css'
import 'react-toastify/dist/ReactToastify.css'
import '/node_modules/primeflex/primeflex.css'
import App from './App.jsx'
import { AuthProvider } from './pages/auth/AuthContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>  
        <App />
        <ToastContainer position='top-right' autoClose={3000} />
        <ConfirmDialog />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
