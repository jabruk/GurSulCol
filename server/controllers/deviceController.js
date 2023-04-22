require('../models/database');
var fs = require("fs");
const Category = require('../models/Category');
const Device = require('../models/Device');
const device = require('../models/Device');
const User = require('../models/User');
const user = require('../models/User');

const bcrypt = require('bcrypt')
const express = require('express')
const app = express()
const session = require('express-session');
const {LocalStorage} = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

app.use(express.json())

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));

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

    const currentUser = req.session.user
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    var countCartItems = Object.keys(cartItems).length;
    res.render('index', { title: 'ITSHOP - Home', categories, typeOfDevice, currentUser, countCartItems } );
    fs.appendFile('input.txt', "\t Redirected to homepage \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
    fs.appendFile('input.txt', "Error Occured in homepage \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
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
      const currentUser = req.session.user
      const cartItems = JSON.parse(localStorage.getItem("cartItems"))
      var countCartItems = Object.keys(cartItems).length;
    res.render('categories', { title: 'ITSHOP - Categoreis', categories, currentUser, countCartItems } );
    fs.appendFile('input.txt', "Redirected to categories \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
    fs.appendFile('input.txt', "Error Occured in categories \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
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
      const currentUser = req.session.user
      const cartItems = JSON.parse(localStorage.getItem("cartItems"))
      var countCartItems = Object.keys(cartItems).length;
    res.render('categories', { title: 'ITSHOP - Categoreis', categoryById, currentUser, countCartItems } );
    fs.appendFile('input.txt', "\t Redirected to category with type " + categoryId, 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
    fs.appendFile('input.txt', "Error Occured in categoriesById \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  }
} 
 
/**
 * GET /device/:id
 * device 
*/
exports.exploredevice = async(req, res) => {
  try {
    let deviceId = req.params.id;
    const device = await Device.findById(deviceId);
    const currentUser = req.session.user
      const cartItems = JSON.parse(localStorage.getItem("cartItems"))
      var countCartItems = Object.keys(cartItems).length;
    res.render('device', { title: 'ITSHOP - device', device, currentUser, countCartItems } );
    fs.appendFile('input.txt', "\t Redirected to device with ID " + deviceId , 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
    fs.appendFile('input.txt', "Error Occured in deviceById \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchdevice = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const currentUser = req.session.user
      const cartItems = JSON.parse(localStorage.getItem("cartItems"))
      var countCartItems = Object.keys(cartItems).length;
    let device = await Device.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'ITSHOP - Search', device, currentUser, countCartItems } );
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
    const limitNumber = 5;
    const device = await Device.find({}).sort({ _id: -1 }).limit(limitNumber);
    console.log(device)
      const currentUser = req.session.user
      const cartItems = JSON.parse(localStorage.getItem("cartItems"))
      var countCartItems = Object.keys(cartItems).length;
      response.render('explore-latest', { title: 'ITSHOP - Explore Latest', device, currentUser, countCartItems } );
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
    let count = await Device.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let device = await Device.findOne().skip(random).exec();
    const currentUser = req.session.user
      const cartItems = JSON.parse(localStorage.getItem("cartItems"))
      var countCartItems = Object.keys(cartItems).length;
    res.render('explore-random', { title: 'ITSHOP - Explore Latest', device, currentUser, countCartItems } );
    fs.appendFile('input.txt', "Redirected to random device \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
    fs.appendFile('input.txt', "Error Occured in random device \t", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;
        });
  }
} 


/**
 * GET /submit-device
 * Submit device
*/
exports.submitdevice = async(req, res) => {
    if (!req.session.user) {
        res.redirect('/signin');
        return;
    }
    if(req.session.user.role==='user'){
        res.redirect('/');
        return;
    }
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
    const currentUser = req.session.user
    console.log(currentUser)
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    var countCartItems = Object.keys(cartItems).length;
  res.render('submit-device', { title: 'ITSHOP - Submit device', infoErrorsObj, infoSubmitObj, currentUser, countCartItems  } );
  fs.appendFile('input.txt', "Redirected to submit device page\t", 'utf8',

      // Callback function
      function(err) {
        if (err) throw err;
      });
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

    fs.appendFile('input.txt', "Data saved successfully! Device has benn added!!", 'utf8',

        // Callback function
        function(err) {
          if (err) throw err;

          //  If no error
          console.log("Data is appended to file successfully.")
        });

    req.flash('infoSubmit', 'Success! Device has been added!')
    res.redirect('/submit-device');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-device');
  }
}


exports.signup = async(req, res) => {
    const errorErrorsObj = req.flash('errorSignUp');
    const infoErrorsObj = req.flash('infoSignUp');
    const currentUser = req.session.user
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    var countCartItems = Object.keys(cartItems).length;
    res.render('signup', { title: 'ITSHOP - Sign Up', infoErrorsObj, errorErrorsObj, currentUser, countCartItems  } );
}


exports.signupOnPost = async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        console.log(user)
        if(!req.body.username || !req.body.password || !req.body.confirmPassword){
            req.flash('errorSignUp', 'Required fields can not be blank!!')
        }
        if (user!==null){
            req.flash('errorSignUp', 'There are already user with username '+req.body.username)
            res.redirect('/signup');
        }
        else {
            try {
                if(req.body.password===req.body.confirmPassword){
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)

                    const newUser = new User({
                        username: req.body.username,
                        password: hashedPassword,
                        role: 'user'
                    });
                    await newUser.save();
                    console.log(newUser)
                    req.flash('infoSignUp', 'Success! New account has been registered!')
                    res.redirect('/signup');
                }else {
                    req.flash('errorSignUp', 'Typed passwords are different!')
                    res.redirect('/signup');
                }
            } catch {
                res.status(500).send()
            }
        }
    } catch (error) {
        req.flash('errorSignUp', error);
    }
}

exports.signin = async(req, res) => {
    const infoErrorsObj = req.flash('infoSignIn');
    const currentUser = req.session.user
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    var countCartItems = Object.keys(cartItems).length;
    res.render('signin', { title: 'ITSHOP - Sign In', infoErrorsObj, currentUser, countCartItems  } );
}

exports.signinOnPost = async(req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (user === null) {
        req.flash('infoSignIn', 'Not found with username ' + req.body.username)
        res.redirect('/signin');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            req.flash('currentUser', user)
            res.redirect('/');
        } else {
            req.flash('infoSignIn', 'Password is incorrect!')
            res.redirect('/signin');
        }
    } catch {
        res.status(500).send()
        console.log('User->' +user)
    }
}

exports.logout = async(req, res) => {
    req.session.user = null
    console.log("working!!!")
    res.redirect('/');
}

exports.cart = async(req, res) => {
    const currentUser = req.session.user
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    var countCartItems = Object.keys(cartItems).length;
    res.render('cart', { title: 'ITSHOP - Cart', currentUser, cartItems, countCartItems  } );
}

exports.cartOnPost = async(req, res) => {
    const device = {
        _id: req.body._id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image,
        quantity: 1
    };

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItem = cartItems.find(item => item.name === device.name);
    if (existingItem) {
        existingItem.quantity += device.quantity;
    } else {
        cartItems.push(device);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(localStorage.getItem("cartItems"))
    console.log('Device-> '+device)
    res.redirect('/device/'+ device._id);
}

exports.clearCart = async(req, res) => {
    let cartItems =  [];

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(localStorage.getItem("cartItems"))
    res.redirect('/cart');
}

exports.decrease = async(req, res) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    const itemIdToModify = req.body._id;
    const itemToModify = cartItems.find(item => item._id === itemIdToModify);
    if (itemToModify) {
        if(itemToModify.quantity >= 2){
            itemToModify.quantity -= 1;
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            console.log(`Item quantity updated: ${itemToModify.name}, new quantity: ${itemToModify.quantity}`);
        } else if (itemToModify.quantity === 1) {
            const newCartItems = cartItems.filter(item => item._id !== itemIdToModify);
            localStorage.setItem("cartItems", JSON.stringify(newCartItems));
            console.log(`Item with ID ${itemIdToModify} removed from cart`);
        }
    } else {
        console.log(`Item with ID ${itemIdToModify} not found in cart`);
    }
    res.redirect('/cart');
}

exports.increase = async(req, res) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    const itemIdToModify = req.body._id;
    const itemToModify = cartItems.find(item => item._id === itemIdToModify);
    if (itemToModify) {
        itemToModify.quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        console.log(`Item quantity updated: ${itemToModify.name}, new quantity: ${itemToModify.quantity}`);
    } else {
        console.log(`Item with ID ${itemIdToModify} not found in cart`);
    }
    res.redirect('/cart');
}

exports.cabinet = async(req, res) => {
    if (!req.session.user) {
        res.redirect('/signin');
        return;
    }
    const infoErrorsObj = req.flash('infoErrorsObj');
    const infoObj = req.flash('infoObj');
    const currentUser = req.session.user
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    var countCartItems = Object.keys(cartItems).length;
    res.render('cabinet', { title: 'ITSHOP - Cabinet', infoErrorsObj, infoObj, currentUser, countCartItems  } );
}

exports.cabinetOnPost = async(req, res) => {
    try {

        const user = await User.findOne({ username: req.body.username })
        console.log(user)
        if(await bcrypt.compare(req.body.prev, user.password)){
        if(req.body.new===req.body.confirm){
            const newHashedPassword = await bcrypt.hash(req.body.new, 10)

            User.findOneAndUpdate({ username: user.username }, { password: newHashedPassword }, { new: true })
                .then(updatedUser => {
                    console.log(`Updated user: ${updatedUser}`);
                })
                .catch(error => {
                    console.error(error);
                });
            req.flash('infoObj', 'Success! Password has been updated!')
            res.redirect('/cabinet');
        }else{
            req.flash('infoErrorsObj', 'Two passwords are different!')
            res.redirect('/cabinet');
        }
    }else {
            req.flash('infoErrorsObj', 'Old password are different!')
            res.redirect('/cabinet');
        }
    } catch (error) {
        req.flash('infoErrorsObj', error);
        console.log(error)
        res.redirect('/');
    }
}

// exports.getall = async(req, res) => {
//     User.find({}).then(function (users) {
//         console.log(users);
//     });
// }

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

