const router = require('express').Router()
const userControl = require('../controllers/userControl')
const Users= require('../models/userModel')

router.post('/register',userControl.register);

router.post('/login', userControl.login)

router.post('/getUserInfor', userControl.getUserInfor)

router.get('/', userControl.getUsersAllInfor)

router.get('/:id', userControl.getUserById);

router.patch('/:id', userControl.updateUser);

router.delete('/:id', userControl.deleteUser)

module.exports = router;