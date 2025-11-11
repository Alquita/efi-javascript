import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { Panel } from 'primereact/panel'
import { ProgressSpinner } from 'primereact/progressspinner'
import { DataScroller } from 'primereact/datascroller'
import { toast } from "react-toastify"
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"

const PostDetail = () => {
    const navigate = useNavigate()
    const { user, token } = useContext(AuthContext)

    const { id } = useParams()
    const postIndex = Number.isInteger(parseInt(id)) ? parseInt(id) : null
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
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

    const fetchComments = async (id) => {
        setLoading(true)

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/posts/${id}/comments`)
            if (!res.ok) throw new Error('Hubo un error al cargar los comentarios')

            const data = await res.json()
            setComments(data)
        } catch (error) {
            console.error('Error al cargar los comentarios', error);
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
        fetchComments(postIndex)
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

    const itemTemplate = (comment) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column align-items-start gap-1">
                                <div className="text-l font-bold text-900">{comment.text}</div>
                                <div className="text-700">{comment.author ? comment.author.username : 'Anonimo'} el {fechaTemplate(comment.created_at)}</div>
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
                            {(user?.role === 'admin' || user?.role === 'moderator' || user?.sub == comment.author_id) &&
                            <div className="flex gap-3">
                                <Button icon='pi pi-trash' onClick={() => deleteComment(comment.id, token)} disabled />
                            </div>
                            }
                        </div>
                    </div>
                </div>
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
                <DataScroller value={comments} itemTemplate={itemTemplate} rows={5} buffer={0.4} header='Comentarios' />
            </div>
            }
        </Fragment>
    )
}

export default PostDetail
