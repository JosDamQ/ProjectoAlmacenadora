import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const AddStorage = () => {
    
    let headers = {
        'Content-Types': 'aplication/json',
        'Authorization': localStorage.getItem('token')
    }

    const [form, setForm] = useState([{
        name: '',
        location: '',
        size: '',
        price: '',
        description: ''
    }])

    const handleChange = (e) =>{
            setForm({
                ...form,
                [e.target.name]: e.target.value
            })
        
    }

    const refresh = () =>{
        window.location.reload()
    }

    const add = async()=>{
        try{
            const { data } = await axios.post(`http://localhost:3300/storage/save`, form, {headers: headers})
            window.location.reload()
        }catch(err){
            console.error(err)
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
            <input onChange={handleChange} name="name" className="form-control" placeholder="Storage Name" type="text" />
            
        </div>

        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-geo-alt"></i> </span>
            </div>
            <input onChange={handleChange} name="location" className="form-control" placeholder="Location" type="text" id="inputLocation"/>
            
        </div>

        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-arrows-angle-expand"></i> </span>
            </div>
            <input onChange={handleChange} name="size" className="form-control" placeholder="Size" type="text" id="inputSize"/>
            
        </div>

        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-cash-coin"></i> </span>
            </div>
            <input onChange={handleChange} name="price" className="form-control" placeholder="Price" type="number" id="inputPrice" min={'1'}/>
            
        </div>

        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-wrench-adjustable"></i> </span>
            </div>
            <textarea onChange={handleChange} name="description" className="form-control" aria-label="With textarea" id="textDescription"></textarea>
            
        </div>
        

    </form>

    
        <button onClick={()=> add()} type="submit" className="btn btn-primary mb-4">Add</button>
    

        <button onClick={()=> refresh()} className="btn btn-warning mb-4">Cancel</button>
    

    </div>
    </>
  )
}
