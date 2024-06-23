const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi=require("joi");

const schemaValidation = Joi.object({
    titre: Joi.string().alphanum().required(),
    
});
const schemaMenu = mongoose.Schema({
    titre:String,
    createProject: { type: Boolean },
    modifierProjet: { type: Boolean },
    deleteProjet: { type: Boolean },
    createEnvironnement: { type: Boolean },
    modifierEnvironnement: { type: Boolean },
    deleteEnvironnement: { type: Boolean },
    getAllEnvironnement: { type: Boolean },
    getOneEnvironnement: { type: Boolean },
    createTicket: { type: Boolean },
    modifierTicket: { type: Boolean },
    getAllCommentaireInTicket: { type: Boolean },
    createCommentaire: { type: Boolean },
    updateCommentaire: { type: Boolean },
    deleteCommentaire: { type: Boolean }
 });

 const Menu = mongoose.model('menu', schemaMenu);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

exports.findById = function(id) {
    return Menu.findOne({ _id: id }); // Assuming _id is the primary key
};

exports.createMenu = (titre,
    createProject,
    modifierProjet,
    deleteProjet,
    createEnvironnement,
    modifierEnvironnement,
    deleteEnvironnement,
    getAllEnvironnement,
    getOneEnvironnement,
    createTicket,
    modifierTicket,
    getAllCommentaireInTicket,
    createCommentaire,
    updateCommentaire,
    deleteCommentaire) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                const menu = new Menu({ titre ,createProject,
                    modifierProjet,
                    deleteProjet,
                    createEnvironnement,
                    modifierEnvironnement,
                    deleteEnvironnement,
                    getAllEnvironnement,
                    getOneEnvironnement,
                    createTicket,
                    modifierTicket,
                    getAllCommentaireInTicket,
                    createCommentaire,
                    updateCommentaire,
                    deleteCommentaire});
                return menu.save();
            })
            .then((savedMenu) => {
                mongoose.disconnect();
                resolve(savedMenu);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};


exports.getAllMenu = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Menu.find();
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}; 


exports.getOneMenu = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Menu.findById(id);
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};


exports.updateOneMenu = async (id, titre ,createProject,
    modifierProjet,
    deleteProjet,
    createEnvironnement,
    modifierEnvironnement,
    deleteEnvironnement,
    getAllEnvironnement,
    getOneEnvironnement,
    createTicket,
    modifierTicket,
    getAllCommentaireInTicket,
    createCommentaire,
    updateCommentaire,
    deleteCommentaire) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mongoose.connect(url);

            const doc = await Menu.updateOne(
                { _id: id },
                {  titre ,createProject,
                    modifierProjet,
                    deleteProjet,
                    createEnvironnement,
                    modifierEnvironnement,
                    deleteEnvironnement,
                    getAllEnvironnement,
                    getOneEnvironnement,
                    createTicket,
                    modifierTicket,
                    getAllCommentaireInTicket,
                    createCommentaire,
                    updateCommentaire,
                    deleteCommentaire}
            );
            console.log("Menu Updated:", doc);
            // Disconnect from MongoDB
            await mongoose.disconnect();

            resolve(doc);
        } catch (err) {
            // Disconnect from MongoDB in case of error
            await mongoose.disconnect();
            reject(err);
        }
    });
};
