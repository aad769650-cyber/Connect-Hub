import React from 'react'
import Header from './component/Header'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './component/MainLayout'
import Home from './component/Home'
import Login from './component/Login'
import AuthPage from './component/Login'
import { Toaster } from 'sonner'
import Explore from './component/Explore'
import  CreatePost  from './component/CreatePost'

const App = () => {
  

const router=createBrowserRouter([{
    path:"/",
    element:<MainLayout></MainLayout>,
    children:[{
        path:"/",
        element:<Home></Home>
    },
  {
        path:"/explore",
        element:<Explore></Explore>
    }
],

  
    
},
{
        path:"/login",
        element:<AuthPage></AuthPage>
    },
{
        path:"/createPost",
        element:<CreatePost></CreatePost>
    }


])

return(
    <>
       <Toaster position="top-center" richColors={true} />
<RouterProvider router={router}></RouterProvider>
</>
)
}

export default App