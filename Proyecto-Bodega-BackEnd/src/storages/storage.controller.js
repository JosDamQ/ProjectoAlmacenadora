'use strict'

const Storage = require('./storage.model');
const Lease = require('../lease/lease.model')

exports.addStorage = async(req, res)=>{
    try {
        let data = req.body
        let existLocation = await Storage.find({
            location: {$regex: data.location, $options: 'i'}
        })
        if(existLocation){
            for(let loc of existLocation){
                if(loc.location.toUpperCase() == data.location.toUpperCase())return res.send({message: 'Location already exist'})
            }
        }
        if(data.availability) return res.status(400).send({message: 'Availability is not allowed'})
        data.availability = true
        let storage = new Storage(data);
        await storage.save();
        return res.send({message: 'Storage created succesfully'})
    } catch (err) {
        console.log(err)
        return res.send({error: err.message})
    }
}

exports.searchByNameStorage = async(req, res)=>{
    try {
        let data = req.body
        let storage = await Storage.find({name: {$regex: data.name, $options: 'i'}})
        if(!storage)return res.status(404).send({message: 'Storage not found'});
        return res.send({storages: storage});
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting storage' });
    }
}

exports.searchById = async(req, res)=>{
    try {
        let storageId = req.params.id;
        let storage = await Storage.findOne({_id: storageId});
        if(!storage) return res.status(404).send({message: 'Storage not found'});
        return res.send({message: 'Storage found', storage});
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting storage' });
    }
}

exports.getStorages = async(req, res)=>{
    try {
        let storages = await Storage.find();
        return res.send({storages})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting storages'});
    }
}

exports.getAvailables = async(req, res)=>{
    try {
        let availables = await Storage.find({availability: true});
        return res.status(201).send({availables})
    } catch (err) {
        console.log(err);
    }
}

exports.updateStorage = async(req, res)=>{
    try {
        let data = req.body;
        let storageId = req.params.id;
        if(data.availability) return res.status(500).send({message: 'Availability is not allowed'})
        let existLocation = await Storage.find({
            location: {$regex: data.location, $options: 'i'}
        })
        if(existLocation){
            for(let loc of existLocation){
                if(loc.location.toUpperCase() == data.location.toUpperCase() && loc._id != storageId )return res.send({message: 'Location already exist'})
            }
        }
        let updateStorage = await Storage.findOneAndUpdate(
            {_id: storageId},
            data,
            {new: true}
        ).lean()
        if(!updateStorage) return res.status(404).send({message:'Storage not found'});
        let lease = await Lease.findOne({storage: storageId}).populate('additionalServices.service');
        if(!lease) return res.send({message: 'Storage updated succesfully', updateStorage});
        let total = updateStorage.price * lease.month;
        lease.additionalServices.forEach(item => {
            total = parseInt(total) + parseInt(item.service.price) * parseInt(lease.month)
        });
        await Lease.findOneAndUpdate({storage: storageId}, {total: total}, {new: true})
        return res.send({message: 'Storage updated succesfully', updateStorage});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error updating storage'});
    }
}

exports.deleteStorage = async(req, res)=>{
    try {
        let storageId = req.params.id;
        let storageLease = await Lease.findOne({storage: storageId})
        if(storageLease) return res.status(400).send({message: 'Storage has a lease'});
        let deleteStorage = await Storage.findOneAndDelete({_id: storageId});
        if(!deleteStorage) return res.status(404).send({message: 'Storage not found'});
        return res.send({message: 'Storage deleted succesfully'});
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error removing product'});
    }
}