import { useNavigate } from "react-router-dom"
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';

const Navbar = () => {
    const navigate = useNavigate()

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => { navigate('/') }
        },
        {
            label: 'Posts',
            icon: 'pi pi-pen-to-square',
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-list',
                    command: () => { navigate('/posts') }
                },
                {
                    label: 'New',
                    icon: 'pi pi-plus',
                    command: () => { navigate('/posts/new') }
                }
            ]
        },
        {
            label: 'Categories',
            icon: 'pi pi-tags',
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-list',
                    command: () => { navigate('/categories') }
                },
                {
                    label: 'New',
                    icon: 'pi pi-plus',
                    command: () => { navigate('/categories/new') }
                }
            ]
        },
        {
            label: 'List Users',
            icon: 'pi pi-user',
            command: () => { navigate('/users') }
        },
        {
            label: 'Stats',
            icon: 'pi pi-chart-bar',
            command: () => { navigate('/stats') }
        }
    ];

    const end = (
        <div>
            <Button
            onClick={() => navigate('/login')}
            label="Login"
            icon='pi pi-sign-in'
            iconPos='right'
            outlined
            />
            <Button
            onClick={() => navigate('/register')}
            label="Register"
            icon='pi pi-user-plus'
            iconPos='right'
            style={{marginLeft:16}}
            />
        </div>
    )

    return (
        <Menubar model={items} end={end} />
    )
}

export default Navbar
