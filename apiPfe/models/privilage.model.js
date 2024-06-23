const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi=require("joi");
const User=require('../models/user.model')

const schemaValidation = Joi.object({
    titre: Joi.string().alphanum().required(),
    utilisateur_id: Joi.string().required()
});

const schemaPrivilage = mongoose.Schema({
   titre:String,
   utilisateur_id:{ type: String, default: null }
});
const Privilage = mongoose.model('privilage', schemaPrivilage);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

exports.createPrivilage = (titre) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                const privilage = new Privilage({ titre });
                return privilage.save();
            })
            .then((savedPrivilage) => {
                mongoose.disconnect();
                resolve(savedPrivilage);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};


exports.assignUtilisateurToPrivilage = async (_id, UtilisateurId) => {
    try {
        await mongoose.connect(url);
        const privilage = await Privilage.findById(_id);
        if (!privilage) {
            mongoose.disconnect();
            throw new Error('privilage not found');
        }
        privilage.utilisateur_id = UtilisateurId; // Set the equipe_id to the provided value
        const updatedProfil = await privilage.save(); // Save the updated user
        mongoose.disconnect();
        return updatedProfil;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

exports.assignUtilisateurToPrivilage = async (_id, UtilisateurId) => {
    try {
        await mongoose.connect(url);
        const privilage = await Privilage.findById(_id);
        if (!privilage) {
            mongoose.disconnect();
            throw new Error('Privilage not found');
        }
        privilage.utilisateur_id = UtilisateurId; // Set the utilisateur_id to the provided value
        const updatedPrivilage = await privilage.save(); // Save the updated privilege
        
        // Now, update the corresponding privilage_id in userModel
        const user = await User.findById(UtilisateurId); // Find the user by ID
        if (!user) {
            mongoose.disconnect();
            throw new Error('User not found');
        }
        user.privilage_id = updatedPrivilage._id; // Update the privilage_id to the new privilege ID
        await user.save(); // Save the updated user
        
        mongoose.disconnect();
        return updatedPrivilage;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

