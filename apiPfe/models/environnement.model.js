const mongoose = require('mongoose');

var schemaEnvironnement=mongoose.Schema({
    titre:String,//prod test preprod...
    type:String,//dev /prod /sit
    description:String,
    adresseIP:String
});

const  Environnement=mongoose.model('environnement',schemaEnvironnement);
const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

exports.findById = function(id) {
    return Environnement.findOne({ _id: id }); // Assuming _id is the primary key
};
// Function to find an Environnement by any field
exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return Environnement.findOne(query).exec(); // Use exec() to return a promise
            })
            .then((environnement) => {
                mongoose.disconnect();
                resolve(environnement);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.createEnvironnement = (titre,type, description, adresseIP, userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                const environnement = new Environnement({ titre,type, description, adresseIP, utilisateur_id: userId }); // Include the user ID
                return environnement.save();
            })
            .then((savedEnvironnement) => {
                mongoose.disconnect();
                resolve(savedEnvironnement);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};



exports.ModifierEnvironnement = async (id, titre, type, description, adresseIP, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mongoose.connect(url);

            const doc = await Environnement.updateOne(
                { _id: id },
                { titre, type, description, adresseIP, utilisateur_id: userId }
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
};

exports.deleteEnvironnement = (id,userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Environnement.deleteOne({ _id: id  });
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};


exports.getAllEnvironnement = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Environnement.find();
        }).then((doc) => {
            
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}; 


exports.getOneEnvironnement = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Environnement.findById(id);
        }).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};


