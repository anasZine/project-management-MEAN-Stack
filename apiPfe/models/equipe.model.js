const mongoose = require('mongoose');

var schemaEquipe=mongoose.Schema({
    titre:String
});

const  Equipe=mongoose.model('equipe',schemaEquipe);
const url = 'mongodb://127.0.0.1:27017/gestionProjet';
const privateKey = "this is my secret key anasanaszine";

exports.findById = function(id) {
    return Equipe.findOne({ _id: id }); // Assuming _id is the primary key
};
// Function to find an Equipe by any field
exports.findOne = (query) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return Equipe.findOne(query).exec(); // Use exec() to return a promise
            })
            .then((equipe) => {
                mongoose.disconnect();
                resolve(equipe);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.createEquipe = (titre) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                const equipe = new Equipe({ titre });
                return equipe.save();
            })
            .then((savedEquipe) => {
                mongoose.disconnect();
                resolve(savedEquipe);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err);
            });
    });
};


 exports.getAllEquipe = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Equipe.find();
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
}; 


exports.getOneEquipe = (id) => {
    return new Promise((resolve, reject) => {
        Equipe.findById(id)
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


exports.ModifierEquipe = async (id, titre) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mongoose.connect(url);

            const doc = await Equipe.updateOne(
                { _id: id },
                { titre }
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

exports.deleteOneEquipe = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Equipe.deleteOne({ _id: id });
        }).then((doc) => {
            mongoose.disconnect();
            resolve(doc);
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    });
};