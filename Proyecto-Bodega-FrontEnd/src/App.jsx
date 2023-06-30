import { useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { createPopper } from '@popperjs/core';
import { Outlet } from 'react-router-dom'

function App() {
  return(
    <>
        <Outlet></Outlet>
    </>
  )
}

export default App
