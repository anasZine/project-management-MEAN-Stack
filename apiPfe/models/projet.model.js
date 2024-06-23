const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require("joi");
const Equipe = require('../models/equipe.model');
/* const schemaValidation = Joi.object({
     titre: Joi.string().alphanum().min(2).max(20).required(),
    equipe: Joi.string().alphanum().min(2).max(25).required(),
    description: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    prioprite: Joi.number().required(),
    statut: Joi.number().required(),
    dateDebut: Joi.number().required(), 
    dateFin: Joi.number().required(), 
    environnement_id:
}); */

const schemaProjet = mongoose.Schema({
    titre: String,
    equipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipe',
        required: true
    },
    description: String,
    priorite: String,
    statut: String,
    avancement: String,
    dateDebut: Date,
    dateFin: Date,
    environnement_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Environnement',
        required: true,
        
    },
    utilisateur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});
schemaProjet.statics.findById = function (id) {
    return this.findOne({ _id: id }); // Assuming _id is the primary key
};
const Projet = mongoose.model('projet', schemaProjet);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

/* exports.createProjet = async function(titre, equipe_id, description, priorite, statut, avancement, dateDebut, dateFin, environnement_id, utilisateur_id) {
    try {
        // Fetch the name of the equipe_id
        const equipe = await Equipe.findById(equipe_id);

        // Create the project
        const projet = new Projet({
            titre: titre,
            equipe: equipe ? equipe.titre : '', // Use the name of the equipe if found
            description: description,
            priorite: priorite,
            statut: statut,
            avancement: avancement,
            dateDebut: dateDebut,
            dateFin: dateFin,
            environnement_id: environnement_id,
            utilisateur_id: utilisateur_id
        });

        const savedProjet = await projet.save();

        return savedProjet;
    } catch (err) {
        throw err;
    }
};

module.exports=Projet */

/* exports.createProjet = (titre, equipe, description, priorite, statut, avancement, dateDebut, dateFin, environnement_id, utilisateur_id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                const projet = new Projet({ titre, equipe, description, priorite, statut, avancement, dateDebut, dateFin, environnement_id, utilisateur_id });
                return projet.save();
            })
            .then((savedProjet) => {
                mongoose.disconnect();
                resolve(savedProjet);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
}; */

/* schemaProjet.statics.createProjet = async function (titre, equipe_id, description, priorite, statut, avancement, dateDebut, dateFin, environnement_id, utilisateur_id) {
    try {
        // Fetch the name of the equipe_id
        const equipe = await Equipe.findById(equipe_id);
        if (!equipe) {
            throw new Error("Equipe not found");
        }

        // Create the project
        const projet = new this({
            titre: titre,
            equipe: equipe_id,
            description: description,
            priorite: priorite,
            statut: statut,
            avancement: avancement,
            dateDebut: dateDebut,
            dateFin: dateFin,
            environnement_id: environnement_id,
            utilisateur_id: utilisateur_id
        });

        const savedProjet = await projet.save();

        return savedProjet;
    } catch (err) {
        throw err;
    }
}; */




// Static method to create a new project
schemaProjet.statics.createProjet = function (
    titre,
    description,
    priorite,
    statut,
    avancement,
    dateDebut,
    dateFin,
    environnement_id,
    utilisateur_id,
    equipe_id, // Accept equipe_id as a parameter
   
) {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            // Create a new project instance
            const projet = new Projet({
                titre: titre,
                description: description,
                priorite: priorite,
                statut: statut,
                avancement: avancement,
                dateDebut: dateDebut,
                dateFin: dateFin,
                environnement_id: environnement_id,
                utilisateur_id: utilisateur_id,
                equipe: equipe_id, // Assign the equipe_id to the project
               
            });

            // Save the project to the database
            projet.save().then(savedProjet => {
                // Disconnect from the MongoDB after saving
                resolve(savedProjet);
            }).catch(err => {
                mongoose.disconnect(); // Disconnect from the MongoDB on error
                reject(err);
            });
        }).catch(err => {
            reject(err); // Reject if there's an error connecting to the MongoDB
        });
    });
};


schemaProjet.statics.ModifierProjet = async (id, titre, description, prioprite, statut, avancement, dateDebut, dateFin, environnement_id, equipe_id, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mongoose.connect(url);

            const doc = await Projet.updateOne(
                { _id: id },
                { titre, description, prioprite, statut, avancement, dateDebut, dateFin, environnement_id, equipe: equipe_id, utilisateur_id: userId }
            );


            mongoose.connect(url);
            
            resolve(doc);
        } catch (err) {
            // Disconnect from MongoDB in case of error
            await mongoose.disconnect();
            reject(err);
        }
    });
};


schemaProjet.statics.deleteProjet = async (id) => {
    await mongoose.connect(url);

    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Projet.deleteOne({ _id: id });
        }).then((doc) => {

            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};


schemaProjet.statics.assignEnironnementToProjet = async (_id,environnementId) => {
    try {
        await mongoose.connect(url);
        const projet = await Projet.findById(_id);
        if (!projet) {
            mongoose.disconnect();
            throw new Error('projet not found');
        }
        projet.environnement_id =environnementId; // Set the equipe_id to the provided value
        const updatedprojet = await projet.save(); // Save the updated projet
        mongoose.disconnect();
        return updatedprojet;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

schemaProjet.statics.getAllProjet = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Projet.find();
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}; 

module.exports = mongoose.model('Projet', schemaProjet);

