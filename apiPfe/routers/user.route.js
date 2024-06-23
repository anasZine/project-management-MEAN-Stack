const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const adminController=require( '../controllers/admin.controller')
const accessControlMiddleware =require('../controllers/authMiddleware')
const accessControlMiddlewareId =require('../controllers/authMiddlewareId')
const jwt = require('jsonwebtoken')




var privateKey = "this is my secret key anasanaszine"
verifyToken = (req, res, next) => {
    let token = req.headers.authorization//t7ot token fl authorization
    //tet79e9 ili fama data jet wla le ml authorization
    if (!token) {//ken mb3thtlich token
        res.status(400).json({ msg: 'access rejected!...' })
    }
    //o hthia tet79e9 ml token shih o nn
    try {// jwt.verify bch tet79e9 ml token
        jwt.verify(token, privateKey)
        next()

    } catch (e) {
        res.status(400).json({ msg: e })
    
    }
}


router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/users/:userId/createProject', (req, res, next) => {
    req.routeFunction = "createProject";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.createProjet);

router.put('/projet/:id/user/:userId/modifierProjet', (req, res, next) => {
    req.routeFunction = "modifierProjet";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.ModifierProjet);

router.delete('/projet/:id/user/:userId/deleteProjet', (req, res, next) => {
    req.routeFunction = "deleteProjet";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware,userController.deleteProjet);

router.post('/users/:userId/createEnvironnement', (req, res, next) => {
    req.routeFunction = "createEnvironnement";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.createEnvironnement);

router.put('/environnements/:id/user/:userId/modifierEnvironnement', (req, res, next) => {
    req.routeFunction = "modifierEnvironnement";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.ModifierEnvironnement);
router.delete('/environnement/:id/user/:userId/deleteEnvironnement', (req, res, next) => {
    req.routeFunction = "deleteEnvironnement";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.deleteEnvironnement);

router.get('/user/:userId/environnements', (req, res, next) => {
    req.routeFunction = "getAllEnvironnement";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.getAllEnvironnement);

router.get('/user/:userId/environnement/:id', (req, res, next) => {
    req.routeFunction = "getOneEnvironnement";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware, userController.getOneEnvironnement);

router.post('/projet/:projetId/user/:userId/createTicket', (req, res, next) => {
    req.routeFunction = "createTicket";
    next();
},verifyToken,userController.createTicket)

router.put('/projet/user/:userId/ticket/:id/updateTicket', (req, res, next) => {
    req.routeFunction = "modifierTicket";
    next();
},verifyToken,userController.ModifierTicket)

router.get('/user/:userId/ticket/:ticketId/comments', (req, res, next) => {
    req.routeFunction = "getAllCommentaireInTicket";
    next();
},verifyToken, userController.getAllCommentaireInTicket);

router.post('/ticket/:ticket_id/user/:userId/comments', (req, res, next) => {
    req.routeFunction = "createCommentaire";
    next();
},verifyToken,accessControlMiddleware.accessControlMiddleware,userController.createCommentaire)

router.put('/comments/:comment_id/user/:userId/updateCommentaire', (req, res, next) => {
    req.routeFunction = "updateCommentaire";
    next();
},verifyToken, userController.updateCommentaire);

router.delete('/comments/:comment_id/user/:userId/deleteCommentaire', (req, res, next) => {
    req.routeFunction = "deleteCommentaire";
    next();
},verifyToken,userController.deleteCommentaire);




router.get('/user/:userId/projets',verifyToken,userController.getProjetsByUserId)
router.get('/equipe/:id',verifyToken, userController.getOneEquipe);
router.get('/equipes',verifyToken, userController.getAllEquipe);
router.get('/projet/:projetId', verifyToken,userController.getOneProjet);

// Get one ticket by project ID
router.get('/Ticket/:ticketId/projet/:projectId', verifyToken, userController.getOneTicketByProjetId);

// Get all tickets by project ID
router.get('/Tickets/:projectId', verifyToken, userController.getAllTicketByProjetId);
router.get('/user/:id',verifyToken, userController.getOneUser);
router.get('/equipe/:id',verifyToken, userController.getOneEquipe);
router.get('/user/:userId/users/equipe/:equipeId',verifyToken, userController.getAllUsersByEquipe);


router.delete('/ticket/:id/user/:userId/deleteTicket',verifyToken,userController.deleteTicket);

router.get('/profils', userController.getAllProfil);
router.put('/projet/:_id/assign-Environnement',verifyToken, userController.assignEnvironnementToProjet);

router.put('/user/:id/updateProfil',userController.updateOneUserWithUser);




/* router.post('/send-email',userController.sendEmail)

router.post("/reset-password",userController.resetPassword)
 */
router.get('/equipe/:equipeId/projets',verifyToken,userController.getProjetsByequipeId)


module.exports = router;
