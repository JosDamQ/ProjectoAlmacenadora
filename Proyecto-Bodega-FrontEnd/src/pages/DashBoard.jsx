import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { StorageTable } from "../components/Storage/StorageTable";
import { AdditionalServicesTable } from "../components/AditionalServices/AdditionalServicesTable";
import { LeasesTable } from "../components/Leases/LeasesTable";
import { UserTable } from "../components/User/UserTable";
import { AddStorage } from "./Storage/AddStorage";
import { AddUser } from "../pages/User/AddUser";
import { AddLeases } from "../pages/Leases/AddLeases";
import { AddAditionalServices } from "../pages/AditionalServices/AddAditionalServices";
import { AddWorker } from "./User/AddWorker";
import { WorkerTable } from "../components/User/WorkerTable";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Index";

export const DashBoard = () => {
  const [vista, setVista] = useState();
  const { dataUser, setDataUser } = useContext(AuthContext);

  let headers = {
    "Content-Type": "aplication/json",
    Authorization: localStorage.getItem("token"),
  };
  const confirmRole = async () => {
    try {
      const { data } = await axios.get("http://localhost:3300/user/getRol", {
        headers: headers
      });
      setDataUser({
        email: data.user.email,
        rol: data.user.rol,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    confirmRole();
  }, []);

  const changeVista = (view) => {
    try {
      //console.log(vista);

      setVista("");
      setVista(view);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div className="container-fluid overflow-hidden">
        <div className="row vh-100 overflow-auto">
          <div className="col-12 col-sm-3 col-xl-2 px-sm-2 px-0 bg-dark d-flex sticky-top">
            <div className="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white">
              <a
                href="/"
                className="d-flex align-items-center pb-sm-3 mb-md-0 me-md-auto text-white text-decoration-none"
              >
                <span className="fs-5">
                  <span className="d-none d-sm-inline">Almacenadora S.A</span>
                </span>
              </a>
              <ul
                className="nav nav-pills flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start"
                id="menu"
              >
                {
                  //botones para cambios de vistas
                }
                {
                  //Storages
                }
                {dataUser.rol == "ADMIN" ? (
                  <li className="nav-item dropdown-center mb-3">
                    <div className="dropdown-center">
                      <i
                        className="fs-5 bi-house dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{cursor: 'pointer'}}
                      >
                        <span className="ms-1 d-none d-sm-inline" style={{cursor: 'pointer'}}>
                          Storages
                        </span>
                      </i>
                      <ul className="dropdown-menu">
                        <li>
                          <span
                            onClick={() => changeVista("AgregarStorage")}
                            className="dropdown-item" 
                            href="#"
                            style={{cursor: 'pointer'}}
                          >
                            Agregar
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={() => changeVista("MostrarStorage")}
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Mostrar
                          </span>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <></>
                )}

                {
                  //services
                }
                {dataUser.rol == "ADMIN" ? (
                  <li className="nav-item dropdown-center mb-3">
                    <div className="dropdown-center">
                      <i
                        className="fs-5 bi bi-bag-plus-fill dropdown-toggle"
                        data-bs-toggle="dropdown"
                        style={{cursor: 'pointer'}}
                        aria-expanded="false"
                      >
                        <span className="ms-1 d-none d-sm-inline" style={{cursor: 'pointer'}}>
                          Services
                        </span>
                      </i>
                      <ul className="dropdown-menu">
                        <li>
                          <span
                            onClick={() => changeVista("AgregarServices")}
                            name="AgregarServices"
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Agregar
                          </span>
                        </li>

                        <li>
                          <span
                            onClick={() => changeVista("MostarServices")}
                            name="MostarServices"
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Mostrar
                          </span>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <></>
                )}

                {
                  //Leases
                }

                <li className="nav-item dropdown-center mb-3">
                  <div className="dropdown-center">
                    <i
                      className="fs-5 bi bi-shop-window dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{cursor: 'pointer'}}
                    >
                      <span className="ms-1 d-none d-sm-inline" style={{cursor: 'pointer'}}>Leases</span>
                    </i>
                    <ul className="dropdown-menu">
                      <li>
                        <span
                          onClick={() => changeVista("AgregarLease")}
                          name="AgregarServices"
                          className="dropdown-item"
                          style={{cursor: 'pointer'}}
                          href="#"
                        >
                          Agregar
                        </span>
                      </li>

                      <li>
                        <span
                          onClick={() => changeVista("MostarLease")}
                          name="MostarServices"
                          className="dropdown-item"
                          style={{cursor: 'pointer'}}
                          href="#"
                        >
                          Mostrar
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>

                {
                  //User
                }

                {dataUser.rol == "ADMIN" ? (
                  <li className="nav-item dropdown-center mb-3">
                    <div className="dropdown-center">
                      <i
                        className="fs-5 bi bi-people-fill dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{cursor: 'pointer'}}
                      >
                        <span className="ms-1 d-none d-sm-inline" style={{cursor: 'pointer'}}>User</span>
                      </i>
                      <ul className="dropdown-menu">
                        <li>
                          <span
                            onClick={() => changeVista("AgregarUser")}
                            name="AgregarServices"
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Agregar
                          </span>
                        </li>

                        <li>
                          <span
                            onClick={() => changeVista("MostarUser")}
                            name="MostarServices"
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Mostrar
                          </span>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <></>
                )}

                {
                  //Worker
                }

                {dataUser.rol == "ADMIN" ? (
                  <li className="nav-item dropdown-center mb-3">
                    <div className="dropdown-center">
                      <i
                        className="fs-5 bi bi-people-fill dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{cursor: 'pointer'}}
                      >
                        <span className="ms-1 d-none d-sm-inline" style={{cursor: 'pointer'}}>Worker</span>
                      </i>
                      <ul className="dropdown-menu">
                        <li>
                          <span
                            onClick={() => changeVista("AgregarWorker")}
                            name=""
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Agregar
                          </span>
                        </li>

                        <li>
                          <span
                            onClick={() => changeVista("MostrarWorker")}
                            name=""
                            className="dropdown-item"
                            style={{cursor: 'pointer'}}
                            href="#"
                          >
                            Mostrar
                          </span>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <></>
                )}
              </ul>
              <div className="py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1">
                <i className="fs-5 bi bi-door-open-fill " style={{cursor: 'pointer'}}></i>
                <span className="d-none d-sm-inline mx-1" style={{cursor: 'pointer'}} onClick={logout}>
                  Log Out
                </span>
              </div>
            </div>
          </div>

          {
            // MOSTRAR CONTENIDO -----------------------------------------------------------------
          }
          <div className="col d-flex flex-column h-sm-100">
            <main className="row overflow-auto">
              <div className="col pt-4">
                {vista == "AgregarStorage" ? (
                  <AddStorage></AddStorage>
                ) : vista == "MostrarStorage" ? (
                  <>
                    {/* <div className="mb-4">
                                <div className='row'>
                                    <span className="input-group-append">Storages</span>
                                </div>
                                <div className="col-md-5 mx-auto">
                                    <div className="input-group">
                                        <input className="form-control border-end-0 border rounded-pill" type="Search Storages" value="" id="example-search-input"/>
                                        <span className="input-group-append">
                                            <button className="btn btn-outline-secondary bg-white border-bottom-0 border rounded-pill ms-n5" type="button">
                                                <i className="bi bi-search"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div> */}
                    <StorageTable></StorageTable>
                  </>
                ) : vista == "AgregarServices" ? (
                  <AddAditionalServices></AddAditionalServices>
                ) : vista == "MostarServices" ? (
                  <AdditionalServicesTable></AdditionalServicesTable>
                ) : vista == "AgregarUser" ? (
                  <AddUser></AddUser>
                ) : vista == "MostarUser" ? (
                  <UserTable></UserTable>
                ) : vista == "AgregarWorker" ? (
                  <AddWorker></AddWorker>
                ) : vista == "MostrarWorker" ? (
                  <WorkerTable></WorkerTable>
                ) : vista == "AgregarLease" ? (
                  <AddLeases></AddLeases>
                ) : (
                  <LeasesTable></LeasesTable>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
