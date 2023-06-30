import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const AddWorker = () => {
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        phone: ''
    })
    
    const handleChange = (e) =>{
            setForm({
                ...form,
                [e.target.name]: e.target.value
            })
        
    }
    
    const refresh = () =>{
        window.location.reload()
    }
    let headers = {
        'Content-Types': 'aplication/json',
        'Authorization': localStorage.getItem('token')
    }
    
    const add = async()=>{
        try{
            const { data } = await axios.post(`http://localhost:3300/user/addWorker`, form, {headers: headers})
            console.log(data);
            window.location.reload()
        }catch(err){
            alert(err.response.data.message)
            console.log(err)
        }
    }
    
    
    return (
    <>
    <div className='container-sm justify-content-center' >
    
    <form className=''>
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-person"></i> </span>
            </div>
            <input onChange={handleChange} name="name" className="form-control" placeholder="Name" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-person"></i> </span>
            </div>
            <input onChange={handleChange} name="surname" className="form-control" placeholder="Surname" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-envelope-at"></i> </span>
            </div>
            <input onChange={handleChange} name="email" className="form-control" placeholder="Email" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-key-fill"></i> </span>
            </div>
            <input onChange={handleChange} name="password" className="form-control" placeholder="Password" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="bi bi-telephone"></i> </span>
                </div>
                <input onChange={handleChange} name="phone" className="form-control" min={'1'} placeholder="phone" type="number" id="inputPrice"/>
                
          </div>
    
        
    
    </form>
    
    
        <button onClick={()=> add()} type="submit" className="btn btn-primary mb-4">Add</button>
    
    
        <button onClick={()=> refresh()} className="btn btn-warning mb-4">Cancel</button>
    
    
    </div>
    </>
    )
}
