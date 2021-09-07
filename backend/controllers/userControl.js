const Users= require('../models/userModel')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const ObjectId= require('mongoose').Types.ObjectId;

const userControl = {
    register: async (req, res) => {
        try{
            const {name, email,phoneNumber, password, date}= req.body
            if(!name || !email || !password ||!phoneNumber ||!date)
                return res.status(400).json({msg:"Please fill in all fields"});
    
            if(!validateEmail(email))
                return res.status(400).json({msg:"Invalid Email"});
    
            if(password.length<6)
                return res.status(400).json({msg:"Password must be atleast 6 characters long"});
    
            if(phoneNumber.length>10 || phoneNumber.length<10)
                return res.status(400).json({msg:"Phone Number must be 10 characters long"});
    
            const existingUser= await Users.findOne({email});
            if(existingUser)
                return res.status(400).json({msg:"This user already exists"});
    
            const passwordHash = await bcrypt.hash(password, 12);   //password hashing
        
            const userData={name, email, phoneNumber, password:passwordHash, date}
            let newUser= new Users(userData);
            newUser.save();
    
            let payload = {subject: newUser._id}
            let token = jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '10m'})
            res.status(200).send({token})
    
        }catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    login: async (req, res) => {
        try{
            const userData= req.body;

            if(!userData.email || !userData.password)
                return res.status(400).json({msg:"Please fill in all fields"});
    
            const user =await Users.findOne({email:userData.email})
            if(!user)
                return res.status(401).json({msg: 'Invalid Email'})
                
            if(userData.password !== user.password) 
                return res.status(401).json({msg: "Password is incorrect."})    
                    
            let payload = {subject: user._id}
            let token = jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET)
            res.status(200).send({token})        
        
        }catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
   
    getUserInfor: async (req, res) => {
        try {
            const userData= req.body
           
            const user =await Users.findOne({email:userData.email})
            if(!user)
                return res.status(401).json({msg: 'Invalid Email'})
                
            const isMatch = bcrypt.compare(userData.password, user.password)
            if(!isMatch) 
                return res.status(400).json({msg: "Password is incorrect."})  
    
            res.status(200).send(user)  ;
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUsersAllInfor: async (req, res) => {
       
        try{
            const users= await Users.find()
            res.send(users)
        }catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUserById: async (req, res) => {
        try{
            if(!ObjectId.isValid(req.params.id))
                return res.status(400).send(`No record with given id:${req.params.id}`);
    
            Users.findById(req.params.id)
            res.json(user)
        }catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateUser: async (req, res) => {
        try {
        const {name, email, phoneNumber, password} = req.body

        if(!name || !email || !password ||!phoneNumber)
            return res.status(400).json({msg:"Please fill in all fields"});
        
        await Users.findOneAndUpdate({_id: req.params.id}, {
            name, email, phoneNumber, password
        });

        res.json({msg: "Update Success!"})
        } catch (err) {
        return res.status(500).json({msg: err.message})
        }
    },

    deleteUser: async (req, res) => {
        try{
            if(!ObjectId.isValid(req.params.id))
                return res.status(400).send(`No record with given id:${req.params.id}`);
    
            await Users.findByIdAndRemove(req.params.id);
            res.json({msg: "Deleted Success!"})
            
        }catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
  
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = userControl