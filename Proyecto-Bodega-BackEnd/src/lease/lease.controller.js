"use strict";

const Lease = require("./lease.model");
const User = require("../user/user.model");
const AdditionalServices = require("../additionalServices/additionalServices.model");
const Storage = require("../storages/storage.model");

exports.createLease = async (req, res) => {
  try {
    let data = req.body;
    if (!data.month) data.month = 1;
    if (data.month == 0)
      return res.status(400).send({ message: "Param Month can not be zero" });
    if (data.total || data.total == "")
      return res.status(400).send({ message: "Total is not allowed" });
    if (data.additionalServices || data.additionalServices == "")
      return res
        .status(400)
        .send({ message: "Additional services is not allowed" });
    let userExist = await User.findOne({ _id: data.user, rol: "CLIENT" });
    if (!userExist) return res.status(404).send({ message: "User not found" });
    let storageExist = await Storage.findOne({ _id: data.storage });
    if (!storageExist)
      return res.status(404).send({ message: "Storage not found" });
    if (!storageExist.availability)
      return res.status(500).send({ message: "Storage is already on lease" });
    data.total = storageExist.price * data.month;
    await Storage.findOneAndUpdate(
      { _id: storageExist._id },
      { availability: false },
      { new: true }
    );
    const startDate = new Date();
    data.startDate = startDate.toISOString().substr(0, 10);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30 * data.month);
    data.endDate = endDate.toISOString().substr(0, 10);

    let newLease = new Lease(data);
    await newLease.save();
    return res.status(200).send({ message: "Lease has been created" });
  } catch (err) {
    console.log(err);
  }
};

exports.getLeases = async (req, res) => {
  try {
    let leases = await Lease.find({})
      .populate("user")
      .populate("storage")
      .populate(`additionalServices.service`);
    return res.status(201).send({ leases });
  } catch (err) {
    console.log(err);
  }
};

exports.getLease = async (req, res) => {
  try {
    let leaseId = req.params.id;
    let lease = await Lease.findOne({ _id: leaseId })
      .populate("user")
      .populate("storage");
    if (!lease) return res.status(404).send({ message: "Lease not found" });
    return res.status(200).send({ lease });
  } catch (err) {
    console.log(err);
  }
};

// Actualizar para cambiar bodega
exports.update = async (req, res) => {
  try {
    let leaseId = req.params.id;
    let data = req.body;
    if (data.month == 0)
      return res.status(400).send({ message: "Param Month can not be zero" });
    //validar que exista el arrendamiento a actualizar
    let leaseExists = await Lease.findOne({ _id: leaseId }).populate('additionalServices.service');
    if (!leaseExists)
      return res.status(404).send({ message: "Lease not found" });
    //validar que no envie 'Additional services'
    if (data.additionalServices || data.additionalServices == "")
      return res
        .status(400)
        .send({ message: "Additional Services is not allowed" });
    //validar que el usuario exista y sea cliente
    let userExists = await User.findOne({ _id: data.user, rol: "CLIENT" });
    if (!userExists) return res.status(404).send({ message: "User not found" });
    //validar que la bodega exista
    let storageExists = await Storage.findOne({ _id: data.storage });
    if (!storageExists)
      return res.status(404).send({ message: "Storage not found" });
    //validar que la bodega no este arrendada
    let leaseStorage = await Lease.findOne({ storage: data.storage });
    if (leaseStorage && leaseStorage._id != leaseId)
      return res.status(404).send({ message: "Storage has a lease" });
    //cambiar el estado de la bodega anterior
    await Storage.findOneAndUpdate(
      { _id: leaseExists.storage },
      { availability: true },
      { new: true }
    );
    //cambiar el estado de la actual bodega
    await Storage.findByIdAndUpdate(
      { _id: data.storage },
      { availability: false },
      { new: true }
    );
    //cambiar fecha inicio
    data.startDate = leaseExists.startDate;
    //cambiar fecha final
    let month = leaseExists.month;
    if (data.month) month = data.month;
    const endDate = new Date(data.startDate);
    endDate.setDate(endDate.getDate() + 30 * month);
    data.endDate = endDate.toISOString().substr(0, 10);
    //cambiar el total
    data.total = storageExists.price * month;
    leaseExists.additionalServices.forEach((item) => {
      data.total = data.total + item.service.price * month;
    });
    //actualizar cambios
    let updatedLease = await Lease.findOneAndUpdate({ _id: leaseId }, data, {
      new: true,
    })
      .populate("user")
      .populate("storage")
      .populate(`additionalServices.service`);;
    return res.status(201).send({ updatedLease });
  } catch (err) {
    console.log(err);
  }
};

// Add additional services
exports.addAdditionalServices = async (req, res) => {
  try {
    let leaseId = req.params.id;
    let data = req.body;
    // Validar que el arrendamiento exista
    let leaseExists = await Lease.findOne({ _id: leaseId });
    if (!leaseExists)
      return res.status(404).send({ message: "Lease not found" });
    // Validar que el servicio exista
    let serviceExists = await AdditionalServices.findOne({
      _id: data.additionalService,
    });
    if (!serviceExists)
      return res.status(404).send({ message: "Additional Services not found" });
    // Validar que no esté en el arreglo
    let msg = leaseExists.additionalServices.map((item) => {
      if (item.service == data.additionalService) return 400;
      return 201;
    });
    if (msg.includes(400))
      return res
        .status(400)
        .send({ message: "Additional Service already exists" });
    // cambiar total
    let total = leaseExists.total + serviceExists.price * leaseExists.month;
    // Agregar servicio adicional al arrendamiento
    let updatedLease = await Lease.findOneAndUpdate(
      { _id: leaseId },
      {
        total: total,
        additionalServices: [
          ...leaseExists.additionalServices,
          {
            service: data.additionalService,
          },
        ],
      },
      { new: true }
    ).populate(`additionalServices.service`);;
    return res.status(201).send({ updatedLease });
  } catch (err) {
    console.log(err);
  }
};

// Delete additional services
exports.deleteAdditionalService = async (req, res) => {
  try {
    let serviceId = req.params.id;
    let data = req.body;
    // validar que exista el arrendamiento
    let leaseExists = await Lease.findOne({ _id: serviceId });
    if (!leaseExists)
      return res.status(404).send({ message: "Lease not found" });
    // validar que exista el servicio en el arrendamiento
    let serviceExists = leaseExists.additionalServices.map((item) => {
      if (item.service == data.additionalService) return true;
      return false;
    });
    if (!serviceExists.includes(true))
      return res.status(404).send({ message: "Service not found" });
    // cambiar el precio
    let service = await AdditionalServices.findOne({
      _id: data.additionalService,
    });
    let total = leaseExists.total - service.price * leaseExists.month;
    await Lease.findOneAndUpdate(
      { _id: serviceId },
      { total: total },
      { new: true }
    );
    // eliminar del arrendamiento
    let deletedService = leaseExists.additionalServices.filter((item) => {
      if (item.service != data.additionalService) return item;
    });
    let updatedService = await Lease.findOneAndUpdate(
      { _id: serviceId },
      {
        total: total,
        additionalServices: deletedService,
      },
      { new: true }
    ).populate("additionalServices.service");
    return res.status(201).send({ updatedService });
  } catch (err) {
    console.log(err);
  }
};

//Eliminar vuelve el estado de la bodega a no disponible y el usuario deja de estar vinculado a esa
exports.delete = async (req, res) => {
  try {
    let leaseId = req.params.id;
    let leaseExists = await Lease.findOne({ _id: leaseId });
    if (!leaseExists)
      return res.status(404).send({ message: "Lease not found" });
    await Storage.findOneAndUpdate(
      { _id: leaseExists.storage },
      { availability: true },
      { new: true }
    );
    await Lease.findOneAndDelete({ _id: leaseId });
    return res.status(201).send({ message: "Lease deleted successfully" });
  } catch (err) {
    console.log(err);
  }
};
