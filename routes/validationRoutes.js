const {Router} = require('express');
const router = Router();
const validationController = require('../controllers/validationController');

router.post('/checkEmailAndPassword', validationController.checkEmailAndPassword);

router.post('/checkEmailExistence', validationController.checkEmailExistence);

router.post('/checkPassword', validationController.checkPassword);

module.exports = router;