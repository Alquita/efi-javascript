import { Fragment, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from 'primereact/card'
import { Button } from "primereact/button"
import { DataView } from "primereact/dataview"
import { classNames } from "primereact/utils"
import { ProgressSpinner } from 'primereact/progressspinner'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from "react-toastify"
import Navbar from "../../components/navbar"
import { AuthContext } from "../auth/AuthContext"

const Posts = () => {
    const navigate = useNavigate()
    const { user, token } = useContext(AuthContext)

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchPosts = async () => {
        setLoading(true)

        try {
            const res = await fetch('http://127.0.0.1:5000/api/posts')
            if (!res.ok) throw new Error('Hubo un error al cargar las publicaciones')

            const data = await res.json()
            setPosts(data)
        } catch (error) {
            console.error('Error al cargar las publicaciones', error);
        } finally {
            setLoading(false)
        }

    }

    const handleDeletePost = (post) => {
        confirmDialog({
            message: `¿Está seguro de que quiere eliminar la publicacion ${post.title}?`,
            header: 'Confirmar eliminado',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deletePost(post.id),
            reject: () => {},
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger'
        })
    }

    const deletePost = async (id) => {
        try {
            console.log(id);
            
            const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            if (!res.ok) throw new Error(`Hubo un error al eliminar la publicacion ${res.status}`)
    
            fetchPosts()
            toast.success('Publicacion eliminada con exito')
        } catch (error) {
            toast.error('Hubo un error al eliminar la publicacion')
            console.error('Hubo un error al eliminar la publicacion', error);
        }
    }

    const postTemplate = (post, index) => {
        return (
            <div className="col-12" key={post.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{post.title}</div>
                            <div>{post.content}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{post.category ? post.category.name : 'Categoria eliminada'}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Button icon="pi pi-info" onClick={() => navigate(`/posts/detail/${post.id}`)} />
                                {(user?.role === 'admin' || user?.sub == post.author_id) &&
                                    <div className="flex gap-3">
                                        <Button icon='pi pi-pencil' onClick={() => navigate(`/posts/${post.id}`)} />
                                        <Button icon='pi pi-trash' onClick={() => handleDeletePost(post)} />
                                    </div>
                                }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return postTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <Fragment>
            <Navbar />
            <Card title='Publicaciones'>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading ? <ProgressSpinner /> :
                    <DataView value={posts} listTemplate={listTemplate} paginator rows={10} />
                }
            </Card>
        </Fragment>
    )
}

export default Posts
