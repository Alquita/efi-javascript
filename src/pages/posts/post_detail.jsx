import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { Panel } from 'primereact/panel'
import { ProgressSpinner } from 'primereact/progressspinner'
import { toast } from "react-toastify"
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"
import Comments from "../../comments/comments"
import CommentForm from "../../comments/comment_form"

const PostDetail = () => {
    const navigate = useNavigate()
    const { user, token } = useContext(AuthContext)

    const { id } = useParams()
    const postIndex = Number.isInteger(parseInt(id)) ? parseInt(id) : null
    const [post, setPost] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchPost = async (id) => {
        setLoading(true)

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/posts/${id}`)
            if (!res.ok) throw new Error('Hubo un error al cargar las publicaciones')

            const data = await res.json()
            setPost(data)
        } catch (error) {
            console.error('Error al cargar las publicaciones', error);
        } finally {
            setLoading(false)
        }
    }

    const fechaTemplate = (strDate) => {
        const date = new Date(strDate)

        return (`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} a las ${date.toLocaleTimeString()}`)
    }

    const deletePost = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            if (!res.ok) throw new Error(`Hubo un error al eliminar la publicacion ${res.status}`)
    
            setTimeout(() => navigate('/posts'), 2000)
            toast.success('Publicacion eliminada con exito')
        } catch (error) {
            toast.error('Hubo un error al eliminar la publicacion')
            console.error('Hubo un error al eliminar la publicacion', error);
        }
    }
    
    useEffect(() => {
        fetchPost(postIndex)
    }, [])

    const headerTemplate = (options) => {
        const className = `${options.className} justify-content-space-between`;

        return (
            <div className={className}>
                <div>
                    <span className="font-bold">{post.title} por {post.author ? post.author.username : 'Anonimo'}</span>
                </div>
                    {(user?.role === 'admin' || user?.sub == post.author_id) &&
                    <div className="flex gap-3">
                        <Button icon='pi pi-pencil' onClick={() => navigate(`/posts/${post.id}`)} />
                        <Button icon='pi pi-trash' onClick={() => deletePost(post.id, token)} />
                    </div>
                    }
            </div>
        )
    }

    const footerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap align-items-center justify-content-between gap-3`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="flex align-items-center gap-2">
                        <i className="pi pi-tag"></i>
                        <span className="font-semibold">{post.category ? post.category.name : 'Categoria eliminada'}</span>
                    </span>
                </div>
                <span className="p-text-secondary">Actualizado el {fechaTemplate(post.updated_at)}</span>
            </div>
        );
    };

    return (
        <Fragment>
            <Navbar />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? <ProgressSpinner /> :
            <div>
                <Panel headerTemplate={headerTemplate} footerTemplate={footerTemplate} className="mt-3">
                    <p className="m-0">{post.content}</p>
                </Panel>
                <CommentForm/>
                <Comments/>
            </div>
            }
        </Fragment>
    )
}

export default PostDetail
