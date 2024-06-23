const mongoose = require('mongoose');
const Joi=require("joi");
const Commentaire=require("./commentaire.model")
const userModel=require('../models/user.model')



/* // Validation input schema
const schemaValidation = Joi.object({
    nom: Joi.string().alphanum().min(2).max(20).required(),
    prenom: Joi.string().alphanum().min(2).max(25).required(),
    email: Joi.string() 
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    profil_id: Joi.number().required(),
    equipe_id: Joi.number().required(),
    privilage_id: Joi.number().required(),
}); */

const schemaTicket = mongoose.Schema({
titre:String,
type:String,
statut:String,
dateOverture:Date,
dateCloture:Date,
description:String,
pieceJointe:String,
commentaire:[{type:mongoose.Schema.Types.ObjectId,ref:'Commentaire'}],
assigne_a:String,
rapporteur:String,
validateur:String,
validateur:String,
projet_id:String
});


const Ticket = mongoose.model('ticket', schemaTicket);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

schemaTicket.statics.updateTicketById = async function(id, update) {
    try {
        // Find the ticket by its ID
        const ticket = await this.findById(id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        
        // Update the ticket with the provided update object
        Object.assign(ticket, update);
        
        // Save the updated ticket
        const updatedTicket = await ticket.save();
        return updatedTicket;
    } catch (error) {
        throw error;
    }
};

exports.findByIdAndUpdate = function(id, update, options) {
    return Ticket.findOneAndUpdate({ _id: id }, update, options);
};
exports.findById = function(id) {
    return Ticket.findOne({ _id: id }); // Assuming _id is the primary key
};

exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return Ticket.findOne(query).exec(); // Use exec() to return a promise
            })
            .then((ticket) => {
                mongoose.disconnect();
                resolve(ticket);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};


 
schemaTicket.statics.createTicket = (
    titre,
    type,
    statut,
    dateOverture,
    dateCloture,
    description,
    pieceJointe,
   // Array of comment IDs
    assigne_a,
    rapporteur,
    validateur,
    projet_id,
    utilisateur_id
) => {return new Promise((resolve, reject) => {
    mongoose.connect(url).then(() => {
        // Create a new ticket instance
        const ticket = new Ticket({
            titre,
            type,
            statut,
            dateOverture,
            dateCloture,
            description,
            pieceJointe,
            // Assign the array of comment IDs directly
            assigne_a,
            rapporteur,
            validateur,
            projet_id,
            utilisateur_id
        });

        // Save the ticket to the database
        return ticket.save();
          
    })
    .then((savedTicket) => {
        
        resolve(savedTicket);
    })
    .catch((err) => {
        reject(err);
    });
});
};


/*  schemaTicket.statics.ModifierTicket = async (id,  titre,
    type,
    statut,
    dateOverture,
    dateCloture,
    description,
    pieceJointe,
    // Assign the array of comment IDs directly
    assigne_a,
    rapporteur,
    validateur) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mongoose.connect(url);

            const doc = await Ticket.updateOne(
                { _id: id },
                {  titre,
                    type,
                    statut,
                    dateOverture,
                    dateCloture,
                    description,
                    pieceJointe,
                    // Assign the array of comment IDs directly
                    assigne_a,
                    rapporteur,
                    validateur,}
            );

            // Disconnect from MongoDB
            await mongoose.disconnect();

            resolve(doc);
        } catch (err) {
            // Disconnect from MongoDB in case of error
            await mongoose.disconnect();
            reject(err);
        }
    });
};  */

schemaTicket.statics.ModifierTicket = async (id, userId, newData) => {
    try {
          // Connect to the database
          await mongoose.connect(url);
        console.log("User ID:", userId);
        // Find the user by its ID
        const user = await userModel.findById(userId);
        console.log("User:", user);
        if (!user) {
            throw new Error("User not found");
        }
        
        // Find the ticket by its ID
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        
        // Update only the fields provided in newData
        for (let key in newData) {
            if (newData.hasOwnProperty(key)) {
                ticket[key] = newData[key];
            }
        }
        
        // Save the updated ticket
        const updatedTicket = await ticket.save();

        return updatedTicket;
    } catch (err) {
        throw err;
    }
};

schemaTicket.statics.deleteTicket = async (id) => {
    await mongoose.connect(url);

    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Ticket.deleteOne({ _id: id });
        }).then((doc) => {

            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

module.exports = mongoose.model('Ticket', schemaTicket);