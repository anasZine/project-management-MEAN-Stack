const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel=require('../models/user.model')

const schemaUser = mongoose.Schema({
    nom: String,
    email: String,
    password: String,
});

const Admin = mongoose.model('admin', schemaUser);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

exports.registerAdmin = (nom, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Admin.findOne({ email: email });
        }).then((doc) => {
            if (doc) {
                mongoose.disconnect();
                reject('this email is exist');
            } else {
                bcrypt.hash(password, 10).then((hashedPassword) => {
                    let user = new Admin({
                        nom: nom,
                        email: email,
                        password: hashedPassword
                    });
                    user.save().then((user) => {
                        mongoose.disconnect();
                        resolve(user);
                    }).catch((err) => {
                        mongoose.disconnect();
                        reject(err);
                    });
                }).catch((err) => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        });
    });
}

exports.loginAdmin = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Admin.findOne({ email: email });
        }).then((user) => {
            if (!user) {
                mongoose.disconnect();
                reject("invalid email and password");
            } else {
                bcrypt.compare(password, user.password).then((same) => {
                    if (same) {
                        let token = jwt.sign({ id: user._id, nom: user.nom,role:'Admin' }, privateKey, {
                            expiresIn: '1h'
                        });
                        mongoose.disconnect();
                        resolve({ token: token, role: 'Admin', nom: user.nom });
                    } else {
                        mongoose.disconnect();
                        reject('invalid password');
                    }
                }).catch((err) => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        });
    });
}


// Assuming you have the email from req.body.email

exports.findOneByEmail = (email) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return Admin.findOne({ email: email }).exec(); // Use exec() to return a promise
            })
            .then((admin) => {
                mongoose.disconnect();
                resolve(admin);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.getAllAdmin = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Admin.find();
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}; 

exports.updateOneUserWithUser = async (id, nom, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(url);

            


            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            const doc = await Admin.updateOne(
                { _id: id },
                { nom, email, password: hashedPassword }
            );

           
            resolve(doc);
        } catch (err) {
            mongoose.disconnect();
            reject(err);
        }
    });
};

