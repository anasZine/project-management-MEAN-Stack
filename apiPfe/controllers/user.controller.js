const userModel = require('../models/user.model')
const Projet = require('../models/projet.model')
const Equipe = require('../models/equipe.model')
const Environnement = require('../models/environnement.model')
const Ticket = require('../models/ticket.model')
const Commentaire = require('../models/commentaire.model');
const profilModel=require( '../models/profil.model' )


const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/gestionProjet';









exports.register = (req, res, next) => {

    const active = req.body.active !== undefined ? req.body.active : false;
    userModel.register(req.body.nom, req.body.prenom, req.body.email, req.body.password, req.body.statut, req.body.profil_id, req.body.equipe_id, req.body.privilage_id, active)
        .then(user => res.status(200).json({ user: user, msg: "added" }))
        .catch(err => res.status(400).json({ error: err }));
}

exports.login = (req, res, next) => {
    userModel.login(req.body.email, req.body.password)
        .then(token => res.status(200).json({ token: token }))
        .catch(err => res.status(400).json({ error: err }));
}


exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ user: user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.createProjet = async (req, res) => {
    try {
        const { userId } = req.params;

        // Extract relevant information from the request body
        const {
            titre,
            description,
            priorite,
            statut,
            avancement,
            dateDebut,
            dateFin,
            environnement,
            equipe // Change here: Receive the equipe name from the request body
        } = req.body;

        // Connect to the database and create the project
        mongoose.connect(url).then(() => {
            // Find the environnement by its titre
            Environnement.findOne({ titre: environnement }).then(foundEnvironnement => {
                if (!foundEnvironnement) {
                    return res.status(404).json({ error: "Environnement not found" });
                }

                // Find the equipe by its name
                Equipe.findOne({ titre: equipe }).then(foundEquipe => {
                    if (!foundEquipe) {
                        return res.status(404).json({ error: "Equipe not found" });
                    }

                    // Create the project using the project model
                    Projet.createProjet(
                        titre,
                        description,
                        priorite,
                        statut,
                        avancement,
                        dateDebut,
                        dateFin,
                        foundEnvironnement._id,
                        userId, // Assigning the user's ID to the project
                        foundEquipe._id // Assigning the equipe's ID to the project
                    ).then(projet => {
                        // Send a success response with the team's name included
                        res.status(201).json({ projet: projet, equipe_nom: equipe, environnement_id: foundEnvironnement._id, msg: "Project created successfully" });
                    }).catch(err => {
                        res.status(500).json({ error: err.message });
                    });
                }).catch(err => {
                    res.status(500).json({ error: err.message });
                });
            }).catch(err => {
                res.status(500).json({ error: err.message });
            });
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
};



exports.ModifierProjet = async (req, res) => {
    const { id } = req.params;
    const { titre, description, prioprite, statut, avancement, dateDebut, dateFin, environnement_id, equipe } = req.body;
    const userId = req.params.userId; // Assuming userId is available in the route parameters
    await mongoose.connect(url);
    
    // Find the equipe ID based on its titre
    Equipe.findOne({ titre: equipe })
        .then(equipeData => {
            if (!equipeData) {
                throw new Error("Equipe not found");
            }
            
            // Call the model function to update the project
            return Projet.ModifierProjet(id, titre, description, prioprite, statut, avancement, dateDebut, dateFin, environnement_id, equipeData._id, userId);
        })
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err.message));
};

exports.getProjetsByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        await mongoose.connect(url)

        const projets = await Projet.find({ utilisateur_id: userId });
        res.status(200).json({ projets: projets });
    } catch (error) {
        res.status(460).json({ error: error.message });
    }
};
exports.getProjetsByequipeId = async (req, res) => {
    const equipeId = req.params.equipeId;
    try {
        await mongoose.connect(url)

        const projets = await Projet.find({ equipe: equipeId });
        res.status(200).json({ projets: projets });
    } catch (error) {
        res.status(460).json({ error: error.message });
    }
};
exports.getOneProjet = async (req, res) => {
    const projetId = req.params.projetId;
    try {
        await mongoose.connect(url);

        const projet = await Projet.findById(projetId);
        if (!projet) {
            return res.status(404).json({ error: "Projet not found" });
        }
        res.status(200).json({ projet: projet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteProjet = (req, res) => {
    const userId = req.params.userId;
    Projet.deleteProjet(req.params.id, userId)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

////////////////////////////////////////////////////

exports.createEnvironnement = async(req, res) => {
    const { id } = req.params; // Extract user ID from route parameters
    const { titre, type, description, adresseIP } = req.body;
    await mongoose.connect(url);


    // Call the model function with the user ID
    Environnement.createEnvironnement(titre, type, description, adresseIP, id)
        .then(environnement => res.status(200).json({ environnement: environnement, msg: "added" }))
        .catch(err => res.status(400).json({ error: err }));
};


exports.ModifierEnvironnement = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, type, description, adresseIP } = req.body;
        const userId = req.params.userId; // Assuming userId is available in the route parameters

        // Call the model function to update the environnement
        Environnement.ModifierEnvironnement(id, titre, type, description, adresseIP, userId)
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(400).json(err));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteEnvironnement = (req, res) => {
    Environnement.deleteEnvironnement(req.params.id, req.params.userId)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}


exports.getAllEnvironnement = async(req, res) => {
    await mongoose.connect(url);

    const userId = req.params.userId;
    Environnement.getAllEnvironnement(userId)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
exports.getOneEnvironnement = (req, res) => {
    Environnement.getOneEnvironnement(req.params.id, req.params.userId)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.assignEnvironnementToProjet = async (req, res) => {
    try {
        const _id = req.params._id;
        const environnementId = req.body.environnementId; // Assuming you pass the environnementId in the request body

        // Check if environnementId is provided
        if (!environnementId) {
            return res.status(400).json({ error: "environnement ID is required" });
        }

        const user = await Projet.assignEnironnementToProjet(_id, environnementId);
        res.status(200).json({ user: user, msg: 'environnement assigned successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




//////////////////////////////////////////

exports.createTicket = async (req, res) => {
    try {
    await mongoose.connect(url);

        const { userId } = req.params;
        // Extract relevant information from the request body
        const {
            titre,
            type,
            statut,
            dateOverture,
            dateCloture,
            description,
            pieceJointe,
            assigne_a,
            rapporteur,
            validateur,
            projet_id
        } = req.body;

        // Create the ticket
        const ticket = await Ticket.createTicket(
            titre,
            type,
            statut,
            dateOverture,
            dateCloture,
            description,
            pieceJointe,
            assigne_a,
            rapporteur,
            validateur,
            projet_id,
            userId
        );

        // Send a success response with the created ticket
        res.status(200).json({ ticket: ticket, msg: "Ticket created successfully" });
    } catch (err) {
        // Handle errors
        res.status(400).json({ error: err.message });
    }
};





exports.createCommentaire = async (req, res) => {
    try {
        await mongoose.connect(url);

        const ticket_id = req.params.ticket_id;
        const utilisateur_id = req.params.userId;
        console.log('Ticket ID:', ticket_id);

        // Check if the ticket_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(ticket_id)) {
            return res.status(400).send({
                message: 'Invalid ticket id',
                data: {}
            });
        }

        // Connect to the MongoDB database
        await mongoose.connect(url);

        // Find the ticket by its ID
        const ticket = await Ticket.findById(ticket_id);
        if (!ticket) {
            // If ticket is not found, disconnect from the database and throw an error
            
            throw new Error('Ticket not found');
        }
        const user = await userModel.findById(utilisateur_id);
        if (!user) {
            // If ticket is not found, disconnect from the database and throw an error
            
            throw new Error('User not found');
        }

        // Create a new Commentaire document
        const newCommentDocument = new Commentaire({
            comment: req.body.comment,
            ticket_id: ticket._id, // Access ticket's _id property
            utilisateur_id: user._id  /// Assuming you have the user ID available in the request
        });

        // Save the new Commentaire document
        const commentData = await newCommentDocument.save();

        // Update the Ticket document to add the new Commentaire ID to its commentaire array
        await Ticket.updateOne(
            { _id: ticket_id },
            { $push: { commentaire: commentData._id } }
        );

        // Disconnect from the database
        

        // Send a success response
        return res.status(200).send({
            message: 'Comment successfully added',
            data: commentData
        });
    } catch (err) {
        // Handle errors
        return res.status(400).send({
            message: err.message,
            data: err
        });
    }
};


exports.getAllCommentaireInTicket = async (req, res) => {
        await mongoose.connect(url);
        try {
        await mongoose.connect(url);

        const ticket_id = req.params.ticketId;
        const userId = req.params.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await mongoose.connect(url);
        
        // Find all comments associated with the given ticket_id
        const comments = await Commentaire.find({ ticket_id: ticket_id });

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(700).json({ error: error.message });
    }
};





exports.updateCommentaire = async (req, res) => {
    let comment_id = req.params.comment_id;
    let userId = req.params.userId;

    // Validate comment_id and userId
    if (!mongoose.Types.ObjectId.isValid(comment_id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            message: 'Invalid comment id or user id',
            data: {}
        });
    }

    try {
        await mongoose.connect(url);

        // Find the comment by its ID and update it with the provided data
        await Commentaire.updateOne({ _id: comment_id, utilisateur_id: userId }, { comment: req.body.comment });

        // Fetch the updated comment
        const updatedComment = await Commentaire.findById(comment_id);

        // Disconnect from MongoDB
        await mongoose.disconnect();

        return res.status(200).json({
            message: 'Comment successfully updated',
            data: updatedComment
        });
    } catch (err) {
        // Disconnect from MongoDB in case of error
        await mongoose.disconnect();
        return res.status(400).json({
            message: err.message,
            data: err
        });
    }
};


exports.deleteCommentaire = async (req, res) => {
    let comment_id = req.params.comment_id;
    let userId = req.params.userId;

    await mongoose.connect(url);
    // Validate comment_id and userId
    if (!mongoose.Types.ObjectId.isValid(comment_id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            message: 'Invalid comment id or user id',
            data: {}
        });
    }

    try {
        await mongoose.connect(url);

        // Find the comment by its ID and associated user ID
        const comment = await Commentaire.findOne({ _id: comment_id, utilisateur_id: userId });

        if (!comment) {
            return res.status(400).send({
                message: 'No comment found for the given user',
                data: {}
            });
        }

        // Delete the comment
        await mongoose.connect(url);

        await Commentaire.deleteOne({ _id: comment_id });

        // Update the associated ticket to remove the comment ID from its commentaire array
        await Ticket.updateOne(
            { _id: comment.ticket_id },
            { $pull: { commentaire: comment_id } }
        );

        // Disconnect from MongoDB
        await mongoose.disconnect();

        return res.status(200).send({
            message: 'Comment successfully deleted',
            data: {}
        });
    } catch (err) {
        // Disconnect from MongoDB in case of error
        await mongoose.disconnect();
        return res.status(400).send({
            message: err.message,
            data: err
        });
    }
};




exports.ModifierTicket = async (req, res) => {
    try {
        const { id, userId } = req.params; // Destructuring parameters
        const newData = req.body;
        
        const updatedTicket = await Ticket.ModifierTicket(id, userId, newData);
        res.status(200).json(updatedTicket);
    } catch (err) {
        // Changed status code to 500 for Internal Server Error
        res.status(500).json({ error: err.message });
    }
};

exports.getOneEquipe = (req, res) => {
    mongoose.connect(url)

    Equipe.getOneEquipe(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
exports.getAllUsersByEquipe = async (req, res) => {
    try {
        await mongoose.connect(url)

        const equipe_id = req.params.equipeId;
        const userId = req.params.userId;
        const users = await userModel.getAllUsersByEquipe(userId, equipe_id);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 












exports.sendEmail = async (req, res, next) => {
    const email = req.body.email;

    mongoose.connect(url)

    try {
        mongoose.connect(url)
        const user = await userModel.findOneByEmailUser(email);
        mongoose.connect(url)
        if (!user) {
            console.log("user not found");
            return res.status(404).json({ message: 'user not found' });
        }
        mongoose.connect(url)


        const payload = { email: user.email };
        const expiryTime = 3600; // Increased to 1 hour
        const privateKey = "this is my secret key anasanaszine";
        const token = jwt.sign(payload, privateKey, { expiresIn: expiryTime }); // Use environment variable for secret
        mongoose.connect(url)


        const newToken = new userTokenE({
            userId: user._id,
            token: token
        });

        mongoose.connect(url)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'anaszine2000@gmail.com',
                pass: 'ptzp ehow wxdp oosb'
            }
        });


        const resetLink = `http://localhost:4200/RforgetEmpl/${token}`; // Use HTTPS and your actual domain


        const mailOptions = {
            from: 'anaszine2000@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            html: `
                <html>
                <head><title>Password Reset </title></head>
                <body>
                    <h1>Password Reset</h1>
                    <p>To reset your password, please click the link below:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>This link will expire in 1 hour.</p>
                </body>
                </html>`
        };

        await transporter.sendMail(mailOptions);
        await newToken.save();

        res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
}


exports.getOneEquipe = async (req, res) => {
    await mongoose.connect(url)


    Equipe.getOneEquipe(req.params.id)
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => {

            res.status(500).json({ error: err.message });
        });
}

exports.getAllEquipe = async (req, res) => {
    await mongoose.connect(url)
    Equipe.getAllEquipe()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.getOneTicketByProjetId = async (req, res) => {
    try {
    await mongoose.connect(url)
      const ticket = await Ticket.findOne({ _id: req.params.ticketId, projet_id: req.params.projectId });
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Get all tickets by project ID
exports.getAllTicketByProjetId = async (req, res) => {
    try {
        await mongoose.connect(url);

        const projectId = req.params.projectId; 
        // Query tickets by the correct project ID field
        const tickets = await Ticket.find({ projet_id: projectId });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        mongoose.disconnect();
    }
};


exports.getOneUser = (req, res) => {
    userModel.getOneUser(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}






exports.deleteTicket = (req, res) => {
    const userId = req.params.userId;
    const ticketId = req.params.id;
    Ticket.deleteTicket(ticketId)
        .then((doc) => {
            if (doc.deletedCount === 0) {
                res.status(404).json({ message: "Ticket not found" });
            } else {
                res.status(200).json({ message: "Ticket deleted successfully", data: doc });
            }
        })
        .catch((err) => res.status(400).json(err))
}

/* 
exports.resetPassword = async (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;
    const privateKey = "this is my secret key anasanaszine";

    try {
        mongoose.connect(url)

        jwt.verify(token, privateKey, async (err, data) => {
            if (err) {
                mongoose.connect(url)

                console.log('Reset link has expired');
                return res.status(400).json({ message: 'Reset link has expired' });
            } else {
                mongoose.connect(url)

                try {
                    mongoose.connect(url)

                    const user = await userModel.findOneByEmailUser(data.email);
                    if (!user) {
                        console.log("user not found");
                        return res.status(404).json({ message: 'user not found' });
                    }
                    mongoose.connect(url)

                    const salt = await bcrypt.genSalt(10);
                    const encryptedPassword = await bcrypt.hash(newPassword, salt);
                    user.password = encryptedPassword;
                    mongoose.connect(url)

                    const updatedUser = await user.save(); // Use save() to update the user's password
                    mongoose.connect(url)

                    console.log('Password reset successfully');
                    return res.status(200).json({ message: 'Password reset successfully' });
                } catch (error) {
                    console.log('Password not reset');
                    return res.status(500).json({ message: 'Password not reset' });
                }
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
}
 */

exports.getAllProfil = (req, res) => {
    profilModel.getAllProfil()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}


exports.updateOneUserWithUser = (req, res) => {
    userModel.updateOneUserWithUser(req.params.id, req.body.nom, req.body.prenom, req.body.email, req.body.password)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}