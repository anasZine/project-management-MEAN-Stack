const mongoose = require('mongoose');
const Joi = require("joi");
const Ticket = require("../models/ticket.model")
const User = require("../models/user.model")


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

const schemaCommentaire = mongoose.Schema({
    comment: String,
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }

}, {
    timestamps: true
});

const Commentaire = mongoose.model('Commentaire', schemaCommentaire);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";


// Create a method to find all commentaires
exports.findById = function (id) {
    return Commentaire.findOne({ _id: id }); // Assuming _id is the primary key
};
// Function to find a single commentaire by its id
exports.findOneCommentaire = async function () {
    try {
        const commentaires = await this.find(); // Find all commentaires
        return commentaires;
    } catch (error) {
        throw new Error(error.message);
    }
}
schemaCommentaire.statics.findById = function (id) {
    return this.findOne({ _id: id }); // Assuming _id is the primary key
};

exports.find = function (ticket_id) {
    try {
        const commentaires = Commentaire.find(ticket_id); // Find all commentaires
        return commentaires;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getAllCommentaireInTicket = async (userId,ticket_id) => {
    return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err))
    .then(async () => {
        await mongoose.connect(url)
        User.findById({ _id:userId });
        try {
            // Find all commentaires associated with the given ticket_id
            const commentaires = await Commentaire.find({ ticket_id: ticket_id });

            return commentaires;
        } catch (err) {
            throw err;
        } finally {
            // Disconnect from the database
            mongoose.disconnect();
        }
    }).catch(err => {
        throw err;
    });
};





module.exports = mongoose.model('Commentaire', schemaCommentaire);