const express = require('express');
const conectToDB = require('./config/db');
const setEnviroment = require('./config/env');
const registerRoutes = require('./routes');
const path = require('path')
const multer = require('multer');
const {v4: uuidv4} = require('uuid')


const app = express();
const PORT = process.env.PORT ||  8080;
// Control where the image get store
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) =>{
		cb(null, uuidv4() + '-' + file.originalname);
	}
})

const fileFilter = (req, file, cb)  => {
	if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
		cb(null, true)
	}else {
		cb(null, false)
	}
}


setEnviroment.setEnvironment(app);
//register multer
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use(multer().single('image'))
conectToDB.connectToDB();


registerRoutes(app);

app.get('/', (req, res) => {

	res.json({ message: `Welcome to the momskitchen api. Running in ${process.env.NODE_ENV} mode.` })
  
  })

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
