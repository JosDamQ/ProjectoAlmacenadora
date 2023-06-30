import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const StorageTable = () => {

  const [storages, setStorages] = useState([{}]);
  const [form, setForm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setForm(e.target.value)
  }

  let headers = {
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("token"),
  };

  const getStorages = async () => {
    try {
      const { data } = await axios.get('http://localhost:3300/storage/get', {headers: headers});
      setStorages(data.storages);
    } catch (err) {
      console.error(err);
    }
  }

  const searchStorages = async () => {
    try {
      const { data } = await axios.post('http://localhost:3300/storage/getByName', {name: form}, {headers: headers} );
      if(!data) getStorages();
      setStorages(data.storages);
    } catch (err) {
      console.error(err);
    }
  }

  const searchStoragesAvailable = async () => {
    try {
      setStorages([]);
      const { data } = await axios.get('http://localhost:3300/storage/getAvailables', {headers: headers});
      if(!data) getStorages();
      setStorages(data.availables);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteStorages = async (id) => {
    try {
      let confirmeDelete = confirm('Estas seguro de eliminar este producto?');
      if (confirmeDelete) {
        await axios.delete(`http://localhost:3300/storage/delete/${id}`, {headers: headers});
        getStorages();
      }
    } catch (err) {
      alert(err.response.data.message)
      console.log(err);
    }
  }


  useEffect(() => {
    getStorages();
  }, []);

  return (
    <>
      <div className="mb-4">
        <div className='content-center'>
          <h1 className="input-group-append">Search Storages:</h1>
        </div>
        <div className="col-md-5 mx-auto">
          <div className="input-group">
            <input onChange={handleChange} name='name' className="form-control border-end-0 border rounded-pill" type="Search Storages" id="example-search-input" />
            <span className="input-group-append">
              <button onClick={searchStorages} className="btn btn-outline-secondary bg-white border-bottom-0 border rounded-pill ms-n5" type="button">
                <i className="bi bi-search"></i>
              </button>
              <button onClick={searchStoragesAvailable} type="submit" className="btn btn-primary ms-1">Storages Available</button>
            </span>
          </div>
        </div>
      </div>
      <table className="table table-striped-columns table-sm">
        <thead className='table-dark'>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Location</th>
            <th scope="col">size</th>
            <th scope="col">price</th>
            <th scope="col">description</th>
            <th scope="col">availability</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {

            storages && storages.map(({_id, name, location, size, price, description, availability}, index) =>{
              return (

                <tr key={index}>
                  <td>{name}</td>
                  <td>{location}</td>
                  <td>{size}</td>
                  <td>{price}</td>
                  <td>{description}</td>
                  <td>{availability ? "Disponible" : "No Disponible"}</td>
                  <td className='d-flex justify-content-center '>
                    <Link to={`/storage/update/${_id}`}>
                      <i className="bi bi-pencil-square"></i>
                    </Link>
                    <i onClick={() => deleteStorages(_id)} className="bi bi-trash"></i>
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
