import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const AddLeases = () => {

    const [startDate, setStartDate] = useState(new Date());

    const [form, setForm] = useState({
        storage: '',
        user: '',
        month: ''
    })

    const handleChange = (e) =>{
        
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    
}

    const [additionalServices, setAdditionalServices] = useState([{}]);

    const headers = {
        "Content-Types": "application/json",
        "Authorization": localStorage.getItem("token"),
      };

    const getAditionalServices = async()=>{
        try {
          const { data } = await axios.get('http://localhost:3300/additionalServices/get', {headers: headers});
          setAdditionalServices(data.services)
        } catch (err) {
          console.error(err);
    
        }
      }

      useEffect(()=> getAditionalServices, []);

const [storages, setStorages] = useState([{}]);

    const getStorages = async() =>{
    try {
        const { data } = await axios.get('http://localhost:3300/storage/get', {headers: headers});
        setStorages(data.storages);
    } catch (err) {
        console.error(err);

    }
    }

    const [userClient, setuserClient] = useState([{}]);

    const getUserClient = async()=>{
        try {
            const { data } = await axios.get('http://localhost:3300/user/getUsers', {headers: headers});
            setuserClient(data.users)
        } catch (err) {
            console.error(err);
    
        }
    }

    useEffect(()=>getUserClient, []);

    useEffect(()=> getStorages, [])



const refresh = () =>{
    window.location.reload()
}

const add = async()=>{
    try{
            
        await axios.post(`http://localhost:3300/lease/newLease`, form, {headers: headers})
        window.location.reload()
    }catch(err){
        alert(err.response.data.message)
        console.error(err)
    }
}

  return (
    <>
    <div className='container-sm justify-content-center' >
        <div className="mb-3">
            <select onChange={handleChange} name='storage' className="form-control" required>
                <option value={''} >Select One Storage</option>
                {
                    storages.map(({_id, name}, i)=>{
                    return (
                        <option key={i} value={_id}>{name}</option>
                    )
                    }) 
                }
            </select>
        </div>

        <div className="mb-3">
            <select onChange={handleChange} name='user' className="form-control" required>
                <option value={''} >Select One User</option>
                {
                    userClient.map(({_id, name, surname}, i)=>{
                    return (
                        <option key={i} value={_id}>{name}, {surname}</option>
                        
                    )
                    }) 
                }
            </select>
        </div>

        <div className="form-group input-group mb-4">
        <input onChange={handleChange} name="month" max={'12'} min={'1'} className="form-control" placeholder="Meses a Arrendar" type="number" />
        
        </div>
    
        <button onClick={()=> add()} type="submit" className="btn btn-primary mb-4">Add</button>
    

        <button onClick={()=> refresh()} className="btn btn-warning mb-4">Cancel</button>
    

    </div>
    </>
  )
}