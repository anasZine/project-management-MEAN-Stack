const adminModel = require('../models/admin.model');
const userModel = require('../models/user.model')
const Equipe = require('../models/equipe.model')
const profilModel = require('../models/profil.model')
const Environnement=require("../models/environnement.model")
const menuModel = require('../models/menu.model')
const privilageModel = require('../models/privilage.model')
const Projet=require('../models/projet.model')
const jwt = require('jsonwebtoken');
const userToken = require('../models/userToken');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')




const url = 'mongodb://127.0.0.1:27017/gestionProjet';



exports.register = (req, res) => {
    adminModel.registerAdmin(req.body.nom, req.body.email, req.body.password)
        .then(user => res.status(200).json({ user: user, msg: "added" }))
        .catch(err => res.status(400).json({ error: err }));
}

exports.login = (req, res) => {
    adminModel.loginAdmin(req.body.email, req.body.password)
        .then(token => res.status(200).json({ token: token }))
        .catch(err => res.status(400).json({ error: err }));
}



exports.activateUser = async (req, res) => {
    try {
        const _id = req.params._id;
        const active = req.body.active
        const user = await userModel.activateUser(_id, active);
        res.status(200).json({ user: user, msg: 'User activated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deactivateUser = async (req, res) => {
    try {
        const _id = req.params._id;
        const active = req.body.active

        const user = await userModel.deactivateUser(_id, active);
        res.status(200).json({ user: user, msg: 'User deactivated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getAllUsers = (req, res) => {
    userModel.getAllUsers()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.getOneUser = (req, res) => {
    userModel.getOneUser(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.deleteOneUser = (req, res) => {
    userModel.deleteOneUser(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.updateOneUser = (req, res) => {
    userModel.updateOneUser(req.params.id, req.body.nom, req.body.prenom, req.body.email, req.body.password, req.body.statut, req.body.profil_id, req.body.equipe_id, req.body.privilage_id, req.body.activate)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
///////////////////////////////////////////
exports.createEquipe = (req, res) => {
    Equipe.createEquipe(req.body.titre)
        .then(equipe => res.status(200).json({ equipe: equipe, msg: "added" }))
        .catch(err => res.status(400).json({ error: err }));
}
exports.getAllEquipe = (req, res) => {
    Equipe.getAllEquipe()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
exports.getOneEquipe = (req, res) => {
    mongoose.connect(url)

    Equipe.getOneEquipe(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.assignEquipeToUser = async (req, res) => {
    try {
        const _id = req.params._id;
        const equipeId = req.body.equipeId; // Assuming you pass the equipeId in the request body

        // Check if equipeId is provided
        if (!equipeId) {
            return res.status(400).json({ error: "Equipe ID is required" });
        }

        const user = await userModel.assignEquipeToUser(_id, equipeId);
        res.status(200).json({ user: user, msg: 'Equipe assigned successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.ModifierEquipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre } = req.body;

        // Call the model function to update the Equipe
        Equipe.ModifierEquipe(id, titre)
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(400).json(err));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.deleteOneEquipe = (req, res) => {
    Equipe.deleteOneEquipe(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

////////////////////////////////////////////////////
exports.createProfil = (req, res) => {

    profilModel.createProfil(req.body.titre)
        .then(profil => res.status(200).json({ profil: profil, msg: "added" }))
        .catch(err => res.status(400).json({ error: err }));
}

exports.getAllProfil = (req, res) => {
    profilModel.getAllProfil()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
exports.getOneProfil = (req, res) => {
    profilModel.getOneProfil(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.assignProfilToUser = async (req, res) => {
    try {
        const _id = req.params._id;
        const profilId = req.body.profilId; // Assuming you pass the profilId in the request body

        // Check if profilId is provided
        if (!profilId) {
            return res.status(400).json({ error: "profil ID is required" });
        }

        const user = await userModel.assignProfilToUser(_id, profilId);
        res.status(200).json({ user: user, msg: 'Equipe assigned successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOneProfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre } = req.body;
        const { menu_id } = req.body;

        // Call the model function to update the Profil
        profilModel.updateOneProfil(id, titre, menu_id)
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(400).json(err));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteOneProfil = (req, res) => {
    profilModel.deleteOneProfil(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
//////////////////////////////////////////////
exports.createMenu = (req, res) => {
    const { titre, createProject,
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
        deleteCommentaire } = req.body; // Extracting titre and function settings from request body
    menuModel.createMenu(titre, createProject,
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
        deleteCommentaire)
        .then(menu => res.status(200).json({ menu: menu, msg: "Menu created successfully" }))
        .catch(err => res.status(500).json({ error: "Failed to create menu", details: err }));
};


exports.updateOneMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, createProject,
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
            deleteCommentaire } = req.body;

        // Call the model function to update the environnement
        menuModel.updateOneMenu(id, titre, createProject,
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
            deleteCommentaire)
            .then((doc) => {
                console.log("Updated Menu Details:", doc);
                res.status(200).json(doc);
            })
            .catch((err) => res.status(400).json(err));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getAllMenu = (req, res) => {
    menuModel.getAllMenu()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}
exports.getOneMenu = (req, res) => {
    menuModel.getOneMenu(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.assignMenuToProfil = async (req, res) => {
    try {
        const _id = req.params._id;
        const MenuId = req.body.MenuId; // Assuming you pass the MenuId in the request body

        // Check if MenuId is provided
        if (!MenuId) {
            return res.status(400).json({ error: "Menu ID is required" });
        }

        const profil = await profilModel.assignMenuToProfil(_id, MenuId);
        res.status(200).json({ profil: profil, msg: 'Menu assigned successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/////////////////////////////////////////

exports.createPrivilage = (req, res) => {

    privilageModel.createPrivilage(req.body.titre)
        .then(privilage => res.status(200).json({ privilage: privilage, msg: "added" }))
        .catch(err => res.status(400).json({ error: err }));
}
exports.assignUtilisateurToPrivilage = async (req, res) => {
    try {
        const _id = req.params._id;
        const UtilisateurId = req.body.UtilisateurId; // Assuming you pass the UtilisateurId in the request body

        // Check if UtilisateurId is provided
        if (!UtilisateurId) {
            return res.status(400).json({ error: "Privilage ID is required" });
        }

        const profil = await privilageModel.assignUtilisateurToPrivilage(_id, UtilisateurId);
        res.status(200).json({ profil: profil, msg: 'Privilage assigned successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getAllProjet = (req, res) => {
    Projet.getAllProjet()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

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

exports.getOneEnvironnement = (req, res) => {
    Environnement.getOneEnvironnement(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}



exports.getAllAdmin = (req, res) => {
    adminModel.getAllAdmin()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}



exports.updateOneUserWithUser = (req, res) => {
    adminModel.updateOneUserWithUser(req.params.id, req.body.nom,req.body.email,req.body.password)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err))
}

exports.sendEmail = async (req, res, next) => {
    const email = req.body.email;
    mongoose.connect(url)

    try {
        mongoose.connect(url)
        const admin = await adminModel.findOneByEmail(email);
        if (!admin) {
            console.log("Admin not found");
            return res.status(404).json({ message: 'Admin not found' });
        }
        mongoose.connect(url)

        const payload = { email: admin.email };
        const expiryTime = 3600; // Increased to 1 hour
        const privateKey = "this is my secret key anasanaszine";
        const token = jwt.sign(payload, privateKey, { expiresIn: expiryTime }); // Use environment variable for secret
        mongoose.connect(url)

        const newToken = new userToken({
            userId: admin._id,
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

        const resetLink = `http://localhost:4200/Rforget/${token}`; // Use HTTPS and your actual domain

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













exports.resetPassword = async (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;
        const privateKey = "this is my secret key anasanaszine";
    
    try {
        jwt.verify(token, privateKey, async (err, data) => {
            if (err) {
                mongoose.connect(url)

                console.log('Reset link has expired');
                return res.status(400).json({ message: 'Reset link has expired' });
            } else {
                try {
                    mongoose.connect(url)

                    const admin = await adminModel.findOneByEmail(data.email);
                    if (!admin) {
                        console.log("Admin not found");
                        return res.status(404).json({ message: 'Admin not found' });
                    }
                    mongoose.connect(url)

                    const salt = await bcrypt.genSalt(10);
                    const encryptedPassword = await bcrypt.hash(newPassword, salt);
                    admin.password = encryptedPassword;
                    mongoose.connect(url)

                    const updatedAdmin = await admin.save(); // Use save() to update the admin's password
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


