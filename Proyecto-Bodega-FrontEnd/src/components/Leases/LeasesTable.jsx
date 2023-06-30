import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const LeasesTable = () => {
  const [lease, setLease] = useState([{}]);
  const [addService, setAddService] = useState(false);
  const [updateLease, setUpdateLease] = useState(false);

  const headers = {
    "Content-Types": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  const getLease = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3300/lease/getLeases",
        { headers: headers }
      );
      if (data.leases) {
        setLease(data.leases);
      }
      getAdditionalServices()
      getUserClient()
      getStorages()
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLease = async (id) => {
    try {
      let confirmeDelete = confirm(
        "Estas seguro de eliminar este arrendamiento?"
      );
      if (confirmeDelete) {
        await axios.delete(`http://localhost:3300/lease/delete/${id}`, {
          headers: headers,
        });
        getLease();
        getAdditionalServices()
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id, service) => {
    try {
      let warning = confirm('¿Desea eliminar este servicio adicional?');
      if(warning){
        await axios.put(
          `http://localhost:3300/lease/deleteAdditionalService/${id}`,
          { additionalService: service },
          { headers: headers }
        )
        getLease();
        getAdditionalServices()
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [additionalService, setAdditionalServices] = useState({});
  const getAdditionalServices = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3300/additionalServices/get",
        { headers: headers }
      );
      setAdditionalServices(data.services);
    } catch (err) {
      console.error(err);
    }
  };

  const [idLease, setIdLease] = useState("");

  const [form, setForm] = useState({
    additionalService: "",
  });

  useEffect(() => {
    getLease()
  }, []);

  const addAditionalService = async (id, action) => {
    try {
      if (addService) {
        if (action == "cancelar") {
          setIdLease(""); 
          setAddService(false);
          return;
        }
        await axios.put(
          `http://localhost:3300/lease/addAdditionalService/${idLease}`,
          { additionalService: form.additionalService },
          { headers: headers }
        );
        setIdLease(""); 
        setAddService(false);
      } else {
        setIdLease(id);
        setAddService(true);
      }
      getLease()
      getAdditionalServices()
    } catch (err) {
      alert(err.response.data.message)
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const [formUpdate, setFormUpdate] = useState({
    name: '',
    nameUser: '',
    storage: '',
    user: '',
    month: ''
})

  const handleChangeUpdate = (e) =>{
        
    setFormUpdate({
        ...formUpdate,
        [e.target.name]: e.target.value
    })
  }


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


    const getOneLease = async (id) => {
      try {
        const { data } = await axios.get(
          `http://localhost:3300/lease/getLease/${id}`,
          { headers: headers }
        )
        if (data.lease) {
          setFormUpdate({
            name: `${data.lease.storage.name} | ${data.lease.storage.location} |
            ${data.lease.storage.size} | Q${data.lease.storage.price} | ${data.lease.storage.description}`,
            nameUser: `${data.lease.user.name} ${data.lease.user.surname}`,
            storage: data.lease.storage._id,
            user: data.lease.user._id,
            month: data.lease.month
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    const [idUpdateLease, setIdUpdateLease] = useState('')
  const update = async(idLease)=>{
    try {
      if(updateLease){
        if(idLease == 'cancelar'){
          setIdUpdateLease("");
          setUpdateLease(false)
          return 
        }
        let body = {
          storage: formUpdate.storage,
          user: formUpdate.user,
          month: parseInt(formUpdate.month)
        }
        let {data} = await axios.put(`http://localhost:3300/lease/update/${idUpdateLease}`,body, {headers: headers})
        console.log(data);
        alert(data.message)
        setIdUpdateLease("");
        setUpdateLease(false)
      }else{
        getOneLease(idLease)
        setIdUpdateLease(idLease)
        setUpdateLease(true)
      }
    } catch (err) {
      alert(err.response.data.message)
      console.log(err);
    }
  }

  return (
    <>
      {addService ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3">
            <select
              onChange={handleChange}
              name="additionalService"
              className="form-control"
              required
            >
              <option value={""}>Select One Service</option>
              {additionalService.map(({ _id, name, description, price }, i) => {
                return (
                  <option key={i} value={_id}>
                    {name} | {description} | Q{price}
                  </option>
                );
              })}
            </select>
          </div>
          <input
            type="submit"
            onClick={() => addAditionalService("", "agregar")}
            value="Agregar"
          />
          <input
            type="submit"
            onClick={() => addAditionalService("", "cancelar")}
            value="Cancelar"
          />
        </form>
      ) : updateLease ? <form>
<div className='container-sm justify-content-center' >
        <div className="mb-3">
            <select onChange={handleChangeUpdate} name='storage' className="form-control">
                <option value={''} >{formUpdate.name}</option>
                {
                    storages.map(({_id, name, location, size, price, description}, i)=>{
                    return (
                        <option key={i} value={_id}>{name} | {location} | {size} | Q{price} | {description}</option>
                    )
                    }) 
                }
            </select>
        </div>

        <div className="mb-3">
            <select onChange={handleChangeUpdate} name='user' className="form-control">
                <option value={''} >{formUpdate.nameUser}</option>
                {
                    userClient.map(({_id, name, surname}, i)=>{
                    return (
                        <option key={i} value={_id}>{name} {surname}</option>
                        
                    )
                    }) 
                }
            </select>
        </div>

        <div className="form-group input-group mb-4">
        <input onChange={handleChangeUpdate} value={formUpdate.month} name="month" max={'12'} min={'1'} className="form-control" placeholder="Meses a Arrendar" type="number" />
        
        </div>

    </div>
        <input type="submit" onClick={(e)=>{update('no')}} value='Actualizar' />
        <input type="submit" onClick={()=>update('cancelar')} value='Cancelar' />
      </form> : (
        <table className="table table-striped-columns table-sm">
          <thead className="table-dark">
            <tr>
              <th scope="col">storage</th>
              <th scope="col">user</th>
              <th scope="col">additionalServices</th>
              <th scope="col">months</th>
              <th scope="col">startDate</th>
              <th scope="col">endDate</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lease.map(
              (
                {
                  _id,
                  storage,
                  user,
                  additionalServices,
                  month,
                  startDate,
                  endDate,
                  total,
                },
                index
              ) => {
                return (
                  <tr key={index}>
                    <td>
                      <ul>
                        <li>{storage?.name}</li>
                        <li>{storage?.location}</li>
                        <li>{storage?.size}</li>
                        <li>Q{storage?.price}.00</li>
                        <li>{storage?.description}</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>{user?.name}</li>
                        <li>{user?.surname}</li>
                        <li>+502 {user?.phone}</li>
                      </ul>
                    </td>
                    <td>
                      <button
                        onClick={() => addAditionalService(_id, "mostrar")}
                      >
                        Agregar servicio
                      </button>
                      {additionalServices ? (
                        additionalServices.map(
                          ({ service }, index) => {
                            return (
                              <ul key={index}>
                                <li>{service?.name}</li>
                                <li>{service?.description}</li>
                                <li>Q{service?.price}.00</li>
                                <li>
                                  <i
                                    onClick={() => deleteService(_id, service?._id)}
                                    className="bi bi-trash"
                                  ></i>
                                </li>
                              </ul>
                            );
                          }
                        )
                      ) : (
                        <></>
                      )}
                    </td>
                    <td>{month}</td>
                    <td>{startDate}</td>
                    <td>{endDate}</td>
                    <td>Q{total}.00</td>
                    <td className="d-flex justify-content-center ">
                      <i className="bi bi-pencil-square" onClick={()=>update(_id)}></i>
                      <i
                        onClick={() => deleteLease(_id)}
                        className="bi bi-trash"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      )}
    </>
  );
};
