import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


export const AddAditionalServices = () => {
  const [form, setForm] = useState([{
    name: '',
    description: '',
    price: ''
    
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
let headers = {
    'Content-Types': 'aplication/json',
    'Authorization': localStorage.getItem('token')
}
const add = async()=>{
    try{
        const { data } = await axios.post(`http://localhost:3300/additionalServices/save`, form, {headers: headers})
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
        <input onChange={handleChange} name="name" className="form-control" placeholder="Service Name" type="text" />
        
    </div>

    <div className="form-group input-group mb-4">
        <div className="input-group-prepend">
            <span className="input-group-text"> <i className="bi bi-cash-coin"></i> </span>
        </div>
        <input onChange={handleChange} name="price" min={'1'} className="form-control" placeholder="Price" type="number" id="inputPrice"/>
        
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
