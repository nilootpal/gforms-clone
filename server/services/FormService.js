const FormModel = require('../db/Form');
const UserModel = require('../db/Users');
const ResponseModel = require('../db/Response');

module.exports = {
    formsGet: async ( req, res ) => {
        try{
            let result = await FormModel.find().lean();
            res.send(result);
        } catch (e) {
            res.send(e);
        }
    },
    createForm: async ( req, res ) => {     
        try {
            let data = {
                createdBy : req.body.createdBy,
                name: req.body.name,
                description: req.body.description
            }

            let newForm = new FormModel(data)
            await newForm.save().then(( docs ) => {
                UserModel.updateOne(
                    { _id: data.createdBy },
                    { $push: { createdForms: docs._id } })
                    .then(() => {
                        console.log("Form id added to user details");
                    })
                    .catch(e => console.log("Got some error in creating form."));
                
                res.status(200).json(docs);
            })
        } catch (e) {
            res.send(e);
        }
    },
    getFormById: async ( req, res ) => {
        try {
            let formId = req.params.formId;
            await FormModel.findOne({ _id: formId }).then(async ( form ) => {
                if(form == null){
                    res.status(404).send('Form not found');
                } else{ 
                    res.status(200).json(form);
                }
            }).catch(e => console.log("Got some error in getting form."));
        } catch (e) {
            res.send(e);
        }
    },
    deleteForm: async ( req, res ) => {
        console.log("Deleting Form");
        try {
            let formId = req.params.formId;
            let userId = req.params.userId;
        
            let form = await FormModel.findOne({ _id: formId });
        
            if (!form) {
                res.status(404).send('Form not found or already deleted');
                return;
            }
        
            if (form.createdBy.toHexString() !== userId) {
                res.status(401).send("You are not the owner of this Form");
                return;
            }
        
            await form.deleteOne();
            console.log('Form deleted');
            res.status(202).send("Form Deleted");     
            
        } catch (e) {
            console.error("Got some error in deleting form:", e);
            res.status(500).send("Internal server error");
        }        
    },
    editForm: async ( req, res ) => {
        try {
            let formId =  req.body.formId;
            let data = {
                name: req.body.name,
                description: req.body.description,
                questions: req.body.questions
            }

            console.log("Form Data Received from Request: ");

            const response = await FormModel.findByIdAndUpdate(formId, data, {new: true});
            res.status(200).send(response)
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    },
    getAllFormsOfUser: async ( req, res ) => {
        try {
            let userId = req.params.userId;
            let user = await UserModel.findOne({ _id: userId });
        
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
        
            let records = await FormModel.find().where('_id').in(user.createdForms).exec();
            res.status(200).json(records);
        
        } catch (e) {
            res.status(500).send(e.message);
        }
    },
    submitResponse: async ( req, res ) => {
        try {
            let data = {
                formId: req.body.formId,
                userId: req.body.userId,
                response: req.body.response
            }
            
            if (data.response.length > 0) {
                let newResponse = new ResponseModel(data);
                
                await newResponse.save().then(( docs ) => {              
                    res.status(200).json(docs);
                })
            } 
            else{
                res.status(400).send("No data to be saved"); 
            } 
        } catch (e) {
            res.send(e)
        }
    },
    allResponses: async ( req, res ) => {
        try{
            let result = await ResponseModel.find().lean();
            res.json(result);     
        } catch (e) {
            res.send(e);
        }
    },
    getResponse: async ( req, res )=>{
        try {
            let formId = req.params.formId;
            await ResponseModel.find({ formId: formId }).then(async ( responses ) => { 
                res.status(200).json(responses)
            }).catch(e => console.log("Got some error in getting responses."));
        } catch (e) {
            res.send(e);
        }
    }
}
