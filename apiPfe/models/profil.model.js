const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi=require("joi");

const schemaValidation = Joi.object({
    titre: Joi.string().alphanum().required(),
    menu_id: Joi.string().required()
});

const schemaProfil = mongoose.Schema({
   titre:String,
   menu_id:{type: mongoose.Schema.Types.ObjectId, ref: 'menu' , default: null }
});
const Profil = mongoose.model('profil', schemaProfil);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";



exports.findById = function(id) {
    return Profil.findOne({ _id: id }); // Assuming _id is the primary key
};


exports.createProfil = (titre) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                const profil = new Profil({ titre });
                return profil.save();
            })
            .then((savedProfil) => {
                mongoose.disconnect();
                resolve(savedProfil);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

 exports.getAllProfil = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Profil.find();
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}; 


exports.getOneProfil = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Profil.findById(id);
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};
exports.deleteOneProfil = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Profil.deleteOne({ _id: id });
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};


exports.updateOneProfil = async (id,titre,menu_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(url);

            let validation = await schemaValidation.validateAsync({
                titre,
                menu_id
                
            });

            if (validation.error) {
                mongoose.disconnect();
                reject(validation.error.details[0].message);
            }

            const doc = await Profil.updateOne(
                { _id: id },
                {  titre,menu_id  }
            );

            mongoose.disconnect();
            resolve(doc);
        } catch (err) {
            mongoose.disconnect();
            reject(err);
        }
    });
};

exports.assignMenuToProfil = async (_id, MenuId) => {
    try {
        await mongoose.connect(url);
        const profil = await Profil.findById(_id);
        if (!profil) {
            mongoose.disconnect();
            throw new Error('Profil not found');
        }
        profil.menu_id = MenuId; // Set the equipe_id to the provided value
        const updatedProfil = await profil.save(); // Save the updated user
        mongoose.disconnect();
        return updatedProfil;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

