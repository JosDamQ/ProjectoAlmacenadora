import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const UpdateWorker = () => {

    const headers = {
        'Content-Types': 'aplication/json',
        'Authorization': localStorage.getItem('token')
    }

    const { id } = useParams();

    const [worker, setWorker] = useState([{}]);

    const getWorker = async()=>{
        try {
          const { data } = await axios.get(`http://localhost:3300/user/getWorker/${id}`, {headers: headers});
          setWorker({
            name: data.worker.name,
            surname: data.worker.surname,
            email: data.worker.email,
            phone: data.worker.phone
          })
        } catch (err) {
          console.error(err);
    
        }
      }

      useEffect(()=>getWorker, [])

    const handleChange = (e) =>{
            setWorker({
                ...worker,
                [e.target.name]: e.target.value
            })
        
    }
    
    const update = async()=>{
        try{
            const { data } = await axios.put(`http://localhost:3300/user/updateWorker/${id}`, worker, {headers: headers})
            console.log(data)
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
            <input defaultValue={worker.name} onChange={handleChange} name="name" className="form-control" placeholder="Full name" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-person"></i> </span>
            </div>
            <input defaultValue={worker.surname} onChange={handleChange} name="surname" className="form-control" placeholder="Full name" type="text" />
            
        </div>

        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-envelope-at"></i> </span>
            </div>
            <input defaultValue={worker.email} onChange={handleChange} name="email" className="form-control" placeholder="Email" type="text" />
            
        </div>
    
    
        <div className="form-group input-group mb-4">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="bi bi-telephone"></i> </span>
                </div>
                <input defaultValue={worker.phone} onChange={handleChange} name="phone" className="form-control" placeholder="phone" type="number" id="inputPrice"/>
                
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
