import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const UserTable = () => {

    const [userClient, setUserClient] = useState([{}]);

    const headers = {
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("token"),
  };

    const getUserClient = async()=>{
        try {
          const { data } = await axios.get('http://localhost:3300/user/getUsers', {headers: headers});
          setUserClient(data.users)
        } catch (err) {
          console.error(err);
    
        }
      }

      useEffect(()=>getUserClient, []);

      const deleteUser = async(id)=>{
        try {
          let warning = confirm('¿Seguro de eliminar ese usuario?')
          if(warning){
            await axios.delete(`http://localhost:3300/user/deleteUser/${id}`, {headers: headers})
            getUserClient();
          }
        } catch (err) {
          getUserClient();
          alert(err.response.data.message);
        }
      }

      return (
        <>
          <table className="table table-striped-columns table-sm">
            <thead className='table-dark'>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Surname</th>
                <th scope="col">phone</th>
                <th scope="col">rol</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
    
                userClient.map(({_id, name, surname, phone, rol}, index) =>{
                  return(
                    
                    <tr key={index}>
                    <td>{name}</td>
                    <td>{surname}</td>
                    <td>{phone}</td>
                    <td>{rol}</td>

                    <td className='d-flex justify-content-center '>
                        <Link to={`/user/update/${_id}`}>
                            <i className="bi bi-pencil-square"></i>
                        </Link>
                            <i className="bi bi-trash" onClick={()=>deleteUser(_id)}></i>
                    </td>
                    </tr>
    
                    
                  )
                })
              }
            </tbody>
          </table>
        </>
      )
}
