import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Posts from './pages/posts/posts'
import PostDetail from './pages/posts/post_detail'
import PostForm from './pages/posts/post_form'
import Categories from './pages/categories/categories'
import CategoryForm from './pages/categories/category_form'
import Users from './pages/users'
import Stats from './pages/stats'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/posts' element={<Posts/>} />
        <Route path='/posts/detail/:id' element={<PostDetail/>} />
        <Route path='/posts/new' element={<PostForm/>} />
        <Route path='/posts/:id' element={<PostForm/>} />
        <Route path='/categories' element={<Categories/>} />
        <Route path='/categories/new' element={<CategoryForm/>} />
        <Route path='/categories/:id' element={<CategoryForm/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/stats' element={<Stats/>} />
      </Routes>
    </>
  )
}

export default App
