import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const UpdateAditionalServices = () => {

    const { id } = useParams();
    const [additionalServices, setAdditionalServices] = useState([{}]);

    const headers = {
        'Content-Types': 'aplication/json',
        'Authorization': localStorage.getItem('token')
    }

    const getAditionalService = async()=>{
        try {
          const { data } = await axios.get(`http://localhost:3300/additionalServices/gets/${id}`, {headers: headers});
          setAdditionalServices({
            name: data.service.name,
            description: data.service.description,
            price: data.service.price
        })
        } catch (err) {
          console.error(err);
    
        }
      }

    useEffect(()=> getAditionalService, [])
    
    const handleChange = (e) =>{
        setAdditionalServices({
                ...additionalServices,
                [e.target.name]: e.target.value
            })
        
    }
    
    const refresh = () =>{
        window.location.reload()
    }
    
    const update = async()=>{
        try{
            const { data } = await axios.put(`http://localhost:3300/additionalServices/update/${id}`, additionalServices, {headers: headers})
            alert('Updated additional service')
        }catch(err){
            alert(err.response.data.message)
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
            <input defaultValue={additionalServices.name} onChange={handleChange} name="name" className="form-control" placeholder="Full name" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-cash-coin"></i> </span>
            </div>
            <input defaultValue={additionalServices.price} onChange={handleChange} name="price" min={'1'} className="form-control" placeholder="price" type="number" id="inputPrice"/>
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-wrench-adjustable"></i> </span>
            </div>
            <textarea defaultValue={additionalServices.description} onChange={handleChange} name="description" className="form-control" aria-label="With textarea" id="textDescription"></textarea>
            
        </div>
        
    
    </form>
    
    
    <Link to="/">
        <button onClick={()=> update()} type="submit" className="btn btn-primary mb-4">Update</button>
    </Link>
        
    
    <Link to="/">
        <button className="btn btn-warning mb-4">Cancel</button>
    </Link>
    
    </div>
    </>
    )
}
