import axios from 'axios';
import React, { useEffect, useState } from 'react'

export const AddUser = () => {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
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
        const { data } = await axios.post(`http://localhost:3300/user/createUser`, form, {headers: headers})
        window.location.reload();
    }catch(err){
        console.log(err);
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
                <span className="input-group-text"> <i className="bi bi-telephone"></i> </span>
            </div>
            <input onChange={handleChange} name="phone" className="form-control" placeholder="Phone" type="number" id="inputPrice" min={'1'}/>
            
      </div>
    

</form>


    <button onClick={()=> add()} type="submit" className="btn btn-primary mb-4">Add</button>


    <button onClick={()=> refresh()} className="btn btn-warning mb-4">Cancel</button>


</div>
</>
)
}
