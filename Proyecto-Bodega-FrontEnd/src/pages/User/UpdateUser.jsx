import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const UpdateUser = () => {

    let headers = {
        'Content-Types': 'aplication/json',
        'Authorization': localStorage.getItem('token')
    }

    const { id } = useParams();

    const [userClient, setUserClient] = useState([{}]);

    const getUserClient = async()=>{
        try {
          const { data } = await axios.get(`http://localhost:3300/user/getUser/${id}`, {headers: headers});
          setUserClient({
            name: data.user.name,
            surname: data.user.surname,
            email: data.user.email,
            password: data.user.password,
            phone: data.user.phone
          })
        } catch (err) {
          console.error(err);
    
        }
      }

    useEffect(()=>getUserClient, [])

    const handleChange = (e) =>{
        setUserClient({
                ...userClient,
                [e.target.name]: e.target.value
            })
        
    }

    const update = async()=>{
        try{
            await axios.put(`http://localhost:3300/user/updateUser/${id}`, userClient, {headers: headers})
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
            <input defaultValue={userClient.name} onChange={handleChange} name="name" className="form-control" placeholder="Full name" type="text" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-person"></i> </span>
            </div>
            <input defaultValue={userClient.surname} onChange={handleChange} name="surname" className="form-control" placeholder="Full name" type="text" />
            
        </div>

    
        <div className="form-group input-group mb-4">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="bi bi-telephone"></i> </span>
                </div>
                <input defaultValue={userClient.phone} onChange={handleChange} name="phone" className="form-control" placeholder="phone" type="number" id="inputPrice"/>
                
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
