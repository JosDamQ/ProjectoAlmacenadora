import React, { createContext, useEffect, useState } from 'react'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { StoragePage } from './pages/Storage/StoragePage'
import { DashBoard } from './pages/DashBoard';
import { UpdateStorage } from './pages/Storage/UpdateStorage';
import { AddStorage } from './pages/Storage/AddStorage';
import { UpdateAditionalServices } from './pages/AditionalServices/UpdateAditionalServices';
import { UpdateLeases } from './pages/Leases/UpdateLeases';
import { UpdateUser } from './pages/User/UpdateUser'
import { UpdateWorker } from './pages/User/UpdateWorker'

export const AuthContext = createContext();

export const Index = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [dataUser, setDataUser] = useState({
        email: '',
        rol: ''
    })

    useEffect(() => {
        let token = localStorage.getItem('token')
        if (token) setLoggedIn(true)
    }, [])

    const routes = createBrowserRouter([
        {
            path: '/',
            element: <App></App>,
            errorElement: <NotFoundPage></NotFoundPage>,
            children: [
                {
                    path: '/',
                    element: loggedIn ? <DashBoard></DashBoard>: <LoginPage></LoginPage>,
                    
                },
                {
                    path: 'storage/update/:id',
                    element: <UpdateStorage></UpdateStorage>
                },
                {
                    path: 'leases/update/:id',
                    element: <UpdateLeases></UpdateLeases>
                },
                {
                    path: 'user/update/:id',
                    element: <UpdateUser></UpdateUser>
                },
                {
                    path: 'worker/update/:id',
                    element: <UpdateWorker></UpdateWorker>
                },
                {
                    path: 'additionalServices/update/:id',
                    element: <UpdateAditionalServices></UpdateAditionalServices>
                }
            ]
        }
    ])

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, dataUser, setDataUser }}>
            <RouterProvider router={routes}></RouterProvider>
        </AuthContext.Provider>
    )
}
