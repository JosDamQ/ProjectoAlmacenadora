"use strict";
const AdditionalServices = require("./additionalServices.model");
const Lease = require("../lease/lease.model");

exports.saveAdditionalService = async (req, res) => {
  try {
    let data = req.body;
    let serviceExists = await AdditionalServices.find({
      name: { $regex: data.name, $options: "i" },
      description: { $regex: data.description, $options: "i" },
    });
    for (const serv of serviceExists) {
      if (
        serv.name.toUpperCase() == data.name.toUpperCase() &&
        serv.description.toUpperCase() == data.description.toUpperCase()
      )
        return res
          .status(400)
          .send({ message: "Additional service already exists" });
    }
    let service = new AdditionalServices(data);
    await service.save();
    return res.send({ message: "Saved services sucessfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: "Error Saving Additional Service", error: err.message });
  }
};

exports.getAdditionalServices = async (req, res) => {
  try {
    let services = await AdditionalServices.find();
    return res.send({ services });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error Getting Additional Servicies" });
  }
};

exports.getAdditionalServiceId = async (req, res) => {
  try {
    let serviceId = req.params.id;
    let service = await AdditionalServices.findOne({ _id: serviceId });
    if (!service) return res.status(404).send({ message: "Service not found" });
    return res.send({ service });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error getting service" });
  }
};

exports.update = async (req, res) => {
  try {
    let serviceId = req.params.id;
    let data = req.body;
    let service = await AdditionalServices.findOne({ _id: serviceId });
    if (!service)
      return res.status(404).send({ message: "additionalServices not found" });
    if (!data.name || data.name == "")
      return res.status(400).send({ message: "Name is required" });
    if (!data.description || data.description == "")
      return res.status(400).send({ message: "Description is required" });
    if (!data.price || data.price == "")
      return res.status(400).send({ message: "Price is required" });

    let serviceExists = await AdditionalServices.find({
      name: { $regex: data.name, $options: "i" },
      description: { $regex: data.description, $options: "i" },
    });
    for (const serv of serviceExists) {
      if (
        serv.name.toUpperCase() == data.name.toUpperCase() &&
        serv.description.toUpperCase() == data.description.toUpperCase() &&
        serv._id != serviceId
      )
        return res
          .status(400)
          .send({ message: "Additional service already exists" });
    }
    let servicesUpdated = await AdditionalServices.findOneAndUpdate(
      { _id: serviceId },
      data,
      { new: true }
    );
    let lease = await Lease.findOne({ "additionalServices.service": serviceId })
        .populate('additionalServices.service')
        .populate('storage');
    if (!lease)
      return res.status(201).send({
          message: "Additional Service updated successfully",
          servicesUpdated});
    let total = lease.storage.price * lease.month;
    lease.additionalServices.forEach(item => {
        total = parseInt(total) + parseInt(item.service.price) * parseInt(lease.month)
    });
    await Lease.findOneAndUpdate({"additionalServices.service": serviceId}, {total: total}, {new: true})
    return res.status(201).send({ servicesUpdated });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error" });
  }
};
