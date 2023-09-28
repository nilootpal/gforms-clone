const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const Image = require('./db/Image');
const mongoose  = require('mongoose');
const router = require('./routes/router');

const app = express();

app.use(cors());
app.use(bodyParser.json({limit : '50mb',extended : true}));
app.use(bodyParser.urlencoded({limit: '50mb',extended : true}));

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{console.log("DB is connected")})
    .catch((e) => console.log(e))

const storage = multer.diskStorage({
    destination: './public',
    filename(req, file, cb) {
        cb(null, "gforms-quesContent-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

app.get('/', async(req, res)=>{
    try{
        let result = await Image.find().lean();
        res.send(result)
    }catch(e){
        res.send(e);
    }
});

app.post('/', upload.single('myfile'), async(req, res) => {
    let data = {
        image: req.file.filename
    }
    let newImage = new Image(data);
        await newImage.save().then((docs)=>{
            console.log(docs);
            res.json({image: docs.image,
                host: req.protocol + '://' + req.get('host')})

        });
});

app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`App listening on port: ${process.env.PORT}`)
})