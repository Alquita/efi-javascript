import { Fragment, useContext, useEffect, useState } from "react"
import { Button } from "primereact/button"
import { DataScroller } from 'primereact/datascroller'
import { useParams } from "react-router-dom"
import { AuthContext } from "../pages/auth/AuthContext"

const Comments = () => {
    const { user, token } = useContext(AuthContext)

    const { id } = useParams()
    const postIndex = Number.isInteger(parseInt(id)) ? parseInt(id) : null

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

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

    useEffect(() => {
        fetchComments(postIndex)
    },[])

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
        <DataScroller value={comments} itemTemplate={itemTemplate} rows={5} buffer={0.4} header='Comentarios' />
    )
}

export default Comments
