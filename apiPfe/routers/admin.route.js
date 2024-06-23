const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const jwt = require('jsonwebtoken')

var privateKey = "this is my secret key anasanaszine"

verifyTokenAdmin=(req,res,next)=>{
    let token=req.headers.authorization
    let role=req.headers.role
    if(!token|| role!='Admin'){
        res.status(400).json({msg:'acces rejected...!!'})
    }
    try{
        jwt.verify(token,privateKey)
        next()
    }catch(e){
        res.status(400).json({msg:e})
    }
}

router.post('/register', adminController.register);
router.post('/login', adminController.login);

router.put('/users/:_id/activate',verifyTokenAdmin, adminController.activateUser); // Route for activating user account
router.put('/users/:_id/deactivate',verifyTokenAdmin, adminController.deactivateUser); 
router.get('/users',verifyTokenAdmin, adminController.getAllUsers);
router.get('/user/:id',verifyTokenAdmin, adminController.getOneUser);
router.delete('/user/:id',verifyTokenAdmin, adminController.deleteOneUser);

router.get('/equipes',verifyTokenAdmin, adminController.getAllEquipe);
router.post('/createEquipe',verifyTokenAdmin, adminController.createEquipe);
router.get('/equipe/:id',verifyTokenAdmin, adminController.getOneEquipe);
router.put('/equipe/:id/modifierEquipe',verifyTokenAdmin, adminController.ModifierEquipe);
router.put('/users/:_id/assign-equipe',verifyTokenAdmin, adminController.assignEquipeToUser);
router.delete('/equipe/:id',verifyTokenAdmin, adminController.deleteOneEquipe);


router.get('/profils',verifyTokenAdmin, adminController.getAllProfil);
router.post('/createProfil',verifyTokenAdmin, adminController.createProfil);
router.get('/profil/:id',verifyTokenAdmin, adminController.getOneProfil);
router.put('/users/:_id/assign-profil',verifyTokenAdmin, adminController.assignProfilToUser);
router.delete('/profil/:id',verifyTokenAdmin, adminController.deleteOneProfil);
router.put('/profil/:id/modifierProfil',verifyTokenAdmin, adminController.updateOneProfil);



router.get('/Menus',verifyTokenAdmin, adminController.getAllMenu);
router.post('/createMenu',verifyTokenAdmin, adminController.createMenu);
router.get('/Menu/:id',verifyTokenAdmin, adminController.getOneMenu);
router.put('/Menu/:id',verifyTokenAdmin, adminController.updateOneMenu);
router.put('/profil/:_id/assign-Menu',verifyTokenAdmin, adminController.assignMenuToProfil);

router.post('/createPrivilage', adminController.createPrivilage);
router.put('/privilage/:_id/assign-utilisateur', adminController.assignUtilisateurToPrivilage);

router.get('/projects',verifyTokenAdmin,adminController.getAllProjet)
router.get('/projet/:projetId', verifyTokenAdmin,adminController.getOneProjet);
router.get('/environnement/:id',verifyTokenAdmin,adminController.getOneEnvironnement)
router.get('/admins',verifyTokenAdmin,adminController.getAllAdmin)
router.put('/user/:id/updateProfil',adminController.updateOneUserWithUser);


router.post('/send-email',adminController.sendEmail)

router.post("/reset-password",adminController.resetPassword)

module.exports = router;
