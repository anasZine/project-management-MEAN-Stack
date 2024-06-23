const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi=require("joi");



// Validation input schema
const schemaValidation = Joi.object({
    nom: Joi.string().alphanum().min(2).max(20).required(),
    prenom: Joi.string().alphanum().min(2).max(25).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    profil_id: Joi.number().required(),
    equipe_id: Joi.number().required(),
    privilage_id: Joi.number().required(),
});

const schemaUser = mongoose.Schema({
    nom:String,
    prenom:String,
    email:String,
    password:String,
    statut:String,
    profil_id:{  type: mongoose.Schema.Types.ObjectId, ref: 'profil', default: null },
    equipe_id:{ type: String, default: null },
    privilage_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'privilage', default: null },
    active: { type: Boolean, default: false }
});
schemaUser.statics.getOneUser = function(id) {
    return this.findById(id); // Assuming findById is correctly implemented
};
schemaUser.statics.findOneAndUpdateCustom = function(filter, update, options) {
    return this.findOneAndUpdate(filter, update, options).exec();
};
schemaUser.statics.findByIdAndUpdate = function(id, update, options) {
    return this.findOneAndUpdate({ _id: id }, update, options);
};
schemaUser.statics.findById = function(id) {
    return this.findOne({ _id: id }); // Assuming _id is the primary key
};
exports.findById = function(id) {
    return this.findOne({ _id: id }); // Assuming _id is the primary key
};
schemaUser.statics.customFind = async function(filter) {
    try {
        // Use findOne to retrieve a single document matching the filter
        const user = await this.findOne(filter);
        return user;
    } catch (error) {
        throw new Error('Error finding user: ' + error.message);
    }
};


exports.findById = function(id) {
    return User.findOne({ _id: id }); // Assuming _id is the primary key
};
exports.getById = (id) => {
    return User.findById(id);
};
const User = mongoose.model('user', schemaUser);

const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";


exports.register = (nom , prenom,email,password,statut,profil_id,equipe_id,privilage_id,active) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return User.findOne({ email: email });
        }).then(doc => {
            if (doc) {
             
                mongoose.disconnect();
                reject('This email already exists');
            } else {
                bcrypt.hash(password, 10).then(hashedPassword => {
                    let user = new User({
                        nom:nom,
                        prenom:prenom,
                        email:email,
                        password: hashedPassword,
                        statut:statut,
                        profil_id:profil_id,
                        equipe_id:equipe_id,
                        privilage_id:privilage_id,
                        active:active

                    });
                    user.save().then(user => {
                        mongoose.disconnect();
                        resolve(user);
                    }).catch(err => {
                        mongoose.disconnect();
                        reject(err);
                    });
                }).catch(err => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        });
    });
}

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return User.findOne({ email: email });
        }).then(user => {
            if (!user) {
                reject('We do not have this email in our database');
            }
            if (!user.active) {
              
                reject('User account is inactive');
            }
            else {
                bcrypt.compare(password, user.password).then(same => {
                    if (same) {
                        let token = jwt.sign({
                            id: user._id,
                            nom: user.nom
                        }, privateKey, {
                            expiresIn: '3h'
                        });
                        mongoose.disconnect();
                        resolve({ token: token, nom: user.nom});
                    } else {
                        mongoose.disconnect();
                        reject('Invalid password');
                    }
                }).catch(err => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        });
    });
}



exports.activateUser = async (_id) => {
    try {
        await mongoose.connect(url);
        const user = await User.findById(_id);
        if (!user) {
            mongoose.disconnect();
            throw new Error('User not found');
        }
        user.active = true; // Set the active status to true
        const updatedUser = await user.save(); // Save the updated user
        mongoose.disconnect();
        return updatedUser;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

exports.deactivateUser = async (_id) => {
    try {
        await mongoose.connect(url);
        const user = await User.findById(_id);
        if (!user) {
            mongoose.disconnect();
            throw new Error('User not found');
        }
        user.active = false; // Set the active status to false
        const updatedUser = await user.save(); // Save the updated user
        mongoose.disconnect();
        return updatedUser;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return User.find();
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

exports.getOneUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return User.findById(id);
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

exports.deleteOneUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return User.deleteOne({ _id: id });
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};

exports.updateOneUser = async (id, nom, prenom, email, password, statut,profil_id,equipe_id,privilage_id,activate) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(url);

            let validation = await schemaValidation.validateAsync({
                nom,
                prenom,
                email,
                
               
                profil_id,
                equipe_id,
                privilage_id,
                
            });

            if (validation.error) {
                mongoose.disconnect();
                reject(validation.error.details[0].message);
            }

            const doc = await User.updateOne(
                { _id: id },
                { nom, prenom , email,password,statut , profil_id , equipe_id,privilage_id }
            );

            mongoose.disconnect();
            resolve(doc);
        } catch (err) {
            mongoose.disconnect();
            reject(err);
        }
    });
};


exports.assignEquipeToUser = async (_id, equipeId) => {
    try {
        await mongoose.connect(url);
        const user = await User.findById(_id);
        if (!user) {
            mongoose.disconnect();
            throw new Error('User not found');
        }
        user.equipe_id = equipeId; // Set the equipe_id to the provided value
        const updatedUser = await user.save(); // Save the updated user
        mongoose.disconnect();
        return updatedUser;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

////////////////////////////////////////////////////
exports.assignProfilToUser = async (_id, profilId) => {
    try {
        await mongoose.connect(url);
        const user = await User.findById(_id);
        if (!user) {
            mongoose.disconnect();
            throw new Error('User not found');
        }
        user.profil_id = profilId; // Set the equipe_id to the provided value
        const updatedUser = await user.save(); // Save the updated user
        mongoose.disconnect();
        return updatedUser;
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

exports.findOneByEmailUser = (email) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return User.findOne({ email: email }).exec(); // Use exec() to return a promise
            })
            .then((user) => {
                mongoose.disconnect();
                resolve(user);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
exports.getAllUsersByEquipe = (userId, equipeId) => {
    return new Promise(async (resolve, reject) => {
        await mongoose.connect(url);
        try {
            const users = await User.find({ equipe_id: equipeId });
            resolve(users);
        } catch (error) {
            reject(error);
        } finally {
            mongoose.disconnect();
        }
    });
};



exports.updateOneUserWithUser = async (id, nom, prenom, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            await mongoose.connect(url);

            


            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            const doc = await User.updateOne(
                { _id: id },
                { nom, prenom, email, password: hashedPassword }
            );

            mongoose.disconnect();
            resolve(doc);
        } catch (err) {
            mongoose.disconnect();
            reject(err);
        }
    });
};







/* module.exports = mongoose.model('User', schemaUser); */




