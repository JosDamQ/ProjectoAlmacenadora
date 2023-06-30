import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const UpdateStorage = () => {

    const [storages, setStorage] = useState({})
    const { id } = useParams();

    let headers = {
        'Content-Types': 'aplication/json',
        'Authorization': localStorage.getItem('token')
    }

    const getStorage = async()=>{
        try {
            const { data } = await axios.get(`http://localhost:3300/storage/getById/${id}`, {headers: headers})
            setStorage({
                name: data.storage.name,
                location: data.storage.location,
                size: data.storage.size,
                price: data.storage.price,
                description: data.storage.description
            })
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(()=> getStorage, [])

    const handleChange = (e)=>{
        setStorage({
            ...storages, 
            [e.target.name]: e.target.value
        })
    }

    const updateStorage = async()=>{
        try{
            const { data } = await axios.put(`http://localhost:3300/storage/update/${id}`, storages, {headers: headers})
            alert(data.message)
        }catch(err){
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
        <input defaultValue={storages.name} name="name" onChange={handleChange} className="form-control" placeholder="Name storages" type="text" id="inputName"/>
        
    </div>

    <div className="form-group input-group mb-4">
		<div className="input-group-prepend">
		    <span className="input-group-text"> <i className="bi bi-geo-alt"></i> </span>
		 </div>
        <input defaultValue={storages.location} name="location" onChange={handleChange} className="form-control" placeholder="location" type="text" id="inputLocation"/>
        
    </div>

    <div className="form-group input-group mb-4">
		<div className="input-group-prepend">
		    <span className="input-group-text"> <i className="bi bi-arrows-angle-expand"></i> </span>
		 </div>
        <input defaultValue={storages.size} name="size" onChange={handleChange} className="form-control" placeholder="size" type="text" id="inputSize"/>
        
    </div>

    <div className="form-group input-group mb-4">
		<div className="input-group-prepend">
		    <span className="input-group-text"> <i className="bi bi-cash-coin"></i> </span>
		 </div>
        <input defaultValue={storages.price} name="price" onChange={handleChange} className="form-control" placeholder="price" type="number" id="inputPrice"/>
        
    </div>

    <div className="form-group input-group mb-4">
		<div className="input-group-prepend">
		    <span className="input-group-text"> <i className="bi bi-wrench-adjustable"></i> </span>
		 </div>
         <textarea defaultValue={storages.description} name='description' onChange={handleChange} className="form-control" aria-label="With textarea" id="textDescription"></textarea>
        
    </div>
    

</form>

    <Link to="/">
        <button onClick={()=> updateStorage()} type="submit" className="btn btn-primary mb-4">Update</button>
    </Link>
    <Link to='/'>
        <button className="btn btn-warning mb-4">Cancel</button>
    </Link>

    </div>
    </>
  )
}
