import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export const AdditionalServicesTable = () => {

    const [additionalServices, setAdditionalServices] = useState([{}]);
    let headers = {
      "Content-Types" : 'aplication/json',
      "Authorization": localStorage.getItem('token')
    }
    const getAditionalServices = async()=>{
        try {
          const { data } = await axios.get('http://localhost:3300/additionalServices/get', {headers: headers});
          setAdditionalServices(data.services)
        } catch (err) {
          console.error(err);
    
        }
      }

      useEffect(()=> getAditionalServices, []);


      return (
        <>
          <table className="table table-striped-columns table-sm">
            <thead className='table-dark'>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
    
                  additionalServices.map(({_id, name, description, price}, index) =>{
                  return(
                    
                    <tr key={index}>
                    <td>{name}</td>
                    <td>{description}</td>
                    <td>{price}</td>

                    <td className='d-flex justify-content-center '>
                        <Link to={`/additionalServices/update/${_id}`}>
                            <i className="bi bi-pencil-square"></i>
                        </Link>
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
