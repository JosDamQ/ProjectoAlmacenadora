import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const WorkerTable = () => {

    const [worker, setWorker] = useState([{}]);
    const [updatePassword, setUpdatePassword] = useState(false);
    const headers = {
      "Content-Types": "application/json",
      "Authorization": localStorage.getItem("token"),
    };

    const getWorker = async()=>{
        try {
          const { data } = await axios.get('http://localhost:3300/user/getWorkers', {headers: headers});
          setWorker(data.workers)
        } catch (err) {
          console.error(err);
    
        }
      }

      useEffect(()=>getWorker, []);

      const deleteWorker = async(id)=>{
        try {
          let warning = confirm('¿Seguro de eliminar ese trabajador?')
          if(warning){
            await axios.delete(`http://localhost:3300/user/deleteWorker/${id}`, {headers: headers})
            getWorker()
          }
        } catch (err) {
          console.log(err);
        }
      }


      const [params, setParams] = useState({
        before: '',
        after: ''
      })
      const [idPerson, setIdPerson] = useState('')
      const handleChange = (e)=>{
        setParams({
          ...params,
          [e.target.name]: e.target.value
        })
      }
      const updatePass = async(id)=>{
        try {
          if(updatePassword){
            if(id=='cancelar'){
              setParams({})
              setUpdatePassword(false)
              return
            }
            const {data} = await axios.put(`http://localhost:3300/user/updatePasswordWorker/${idPerson}`, params, {headers: headers})
            alert(data.message)
            getWorker()
            setUpdatePassword(false)
          }else{
            setIdPerson(id)
            setUpdatePassword(true)
          }
        } catch (err) {
          alert(err.response.data.message)
          console.log(err);
        }
      }

      return (
        <>
          {updatePassword ? <form><div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-person"></i> </span>
            </div>
            <input onChange={handleChange} name="before" className="form-control" placeholder="Before password" type="password" />
            
        </div>
    
        <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="bi bi-person"></i> </span>
            </div>
            <input onChange={handleChange} name="after" className="form-control" placeholder="New password" type="password" />
            
        </div>
        <input type='submit' value={'Update Password'} onClick={(e)=>{e.preventDefault(); updatePass('no')}}/>
        <input type='submit' value={'Cancelar'} onClick={()=>updatePass('cancelar')}/>
        </form> : <table className="table table-striped-columns table-sm">
            <thead className='table-dark'>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Surname</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">phone</th>
                <th scope="col">rol</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
    
                worker.map(({_id, name, surname, email, phone, rol}, index) =>{
                  return(
                    
                    <tr key={index}>
                    <td>{name}</td>
                    <td>{surname}</td>
                    <td>{email}</td>
                    <td className='text-center'>
                    <i className="bi bi-pencil-square" onClick={()=>updatePass(_id)} style={{cursor: 'pointer'}}></i>
                    </td>
                    <td>{phone}</td>
                    <td>{rol}</td>

                    <td className='d-flex justify-content-center '>
                        <Link to={`/worker/update/${_id}`}>
                            <i className="bi bi-pencil-square"></i>
                        </Link>
                        <i className="bi bi-trash" onClick={()=>deleteWorker(_id)} style={{cursor: 'pointer'}}></i>
                    </td>
                    </tr>
    
                    
                  )
                })
              }
            </tbody>
          </table>}
        </>
      )
}
