require('../models/database');
const Category = require('../models/Category');
const device = require('../models/device');



/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await device.find({}).sort({_id: -1}).limit(limitNumber);
    const mobile = await device.find({ 'category': 'Mobile' }).limit(limitNumber);
    const computer = await device.find({ 'category': 'Computer' }).limit(limitNumber);

    const typeOfDevice = {latest , computer, mobile};

    res.render('index', { title: 'Cooking Blog - Home', categories, typeOfDevice } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await device.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /device/:id
 * device 
*/
exports.exploredevice = async(req, res) => {
  try {
    let deviceId = req.params.id;
    const device = await device.findById(deviceId);
    res.render('device', { title: 'Cooking Blog - device', device } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchdevice = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let device = await device.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', device } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, response) => {
  try {
    const limitNumber = 20;
    const device = await device.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', device } );
  } catch (error) {
    response.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await device.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let device = await device.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', device } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-device
 * Submit device
*/
exports.submitdevice = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-device', { title: 'Cooking Blog - Submit device', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-device
 * Submit device
*/
exports.submitdeviceOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newdevice = new device({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: newImageName
    });
    
    await newdevice.save();

    req.flash('infoSubmit', 'device has been added.')
    res.redirect('/submit-device');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-device');
  }
}




// Delete device
// async function deletedevice(){
//   try {
//     await device.deleteOne({ name: 'New device From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deletedevice();


// Update device
// async function updatedevice(){
//   try {
//     const res = await device.updateOne({ name: 'New device' }, { name: 'New device Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updatedevice();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmydeviceData(){
//   try {
//     await device.insertMany([
//       { 
//         "name": "device Name Goes Here",
//         "description": `device Description Goes Here`,
//         "email": "deviceemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "device Name Goes Here",
//         "description": `device Description Goes Here`,
//         "email": "deviceemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmydeviceData();

