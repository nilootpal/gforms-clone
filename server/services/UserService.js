const UserModel = require('../db/Users')
const jwt = require('jsonwebtoken');

module.exports = {
    loginGet: async ( req, res ) => {
        try{
            let result = await UserModel.find().lean();
            res.send(result);     
        }catch(e){
            res.send(e);
        }
    },

    login: async(req,res)=>{   
        console.log("Login Request initiated")
        try {
            let result = await UserModel.findOne({ email: req.body.email }).lean();
            if(!result){
                let name = req.body.name;
                if(name) {
                    let gData = {
                        name: name,
                        email: req.body.email,
                    }
                    
                    let newUser = new UserModel(gData)
                    newUser.save().then((docs)=>{                        
                        let user = { 
                            id: docs._id, 
                            name: docs.name,  
                            email: docs.email,
                        }
                        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
                        res.status(200).json({ accessToken });
                    })
                } else {
                    res.status(404).send("Insufficient Data");
                }
            } else {        
                let user = { 
                    id: result._id, 
                    name: result.name,  
                    email: result.email,
                }
                    
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
                res.status(200).json({ accessToken });   
            }  
        } catch (error) {
            res.send(error)
        }
    }

}