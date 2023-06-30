import axios from 'axios'
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Index'
import './Login.css';

export const LoginPage = () => {
  const navigate = useNavigate()
  const {setLoggedIn, loggedIn, setDataUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const login = async(e)=>{
    try{
      e.preventDefault()  
      const { data } = await axios.post('http://localhost:3300/user/login', form)
      if(data.token){
        setLoggedIn(true)
        localStorage.setItem('token', data.token)
        setDataUser({
          email: data.userLogged.email,
          rol: data.userLogged.rol
        })
        navigate('/')
      }
    }catch(err){
      console.log(err)
      alert(err.response.data.message)
      throw new Error('Error login failed')
    }
  }

  return (
    <>
      <div className='wrapper bg-dark d-flex align-items-center justify-content-center w-100'>
        <div className='login'>
          <h2 className='mb-3'>Login Storages S.A.</h2>
          <form className='needs-validation '>
            <div className='form-group was-validated mb-2'>
              <label htmlFor='email' className='form-label'> Email Address</label>
              <input onChange={handleChange} name='email' type='email' className='form-control' required></input>
              <div className='invalid-feedback'>
                Please enter your email
              </div>
            </div>
            <div className='form-group was-validated mb-2'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input onChange={handleChange} name='password' type='password' className='form-control' required></input>
              <div className='invalid-feedback'>
                Please enter your password
              </div>
            </div>
            <button onClick={(e)=> login(e)} type='submit' className='btn btn-success w-100 mt-2'>Sign</button>
          </form>
        </div>
      </div>
    </>
  )
}