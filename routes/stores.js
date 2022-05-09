const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
let bcrypt = require('bcrypt');
const User = require('../models/user');


// Function to change de currency format
const currencyMeth = (value) => {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

// Function to change the date format
const dateShort = (date) => {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Function to sort the concepts by type
const sortConcepts = (concepts) => {
    const validArray = concepts.every(
      concept => Number.isInteger(concept) || 
      Number.isInteger(parseInt(concept)) || 
      Number.isInteger(parseFloat(concept)));
    if (validArray) {
      return concepts.sort(function(a, b){return a-b});
    } else {
      return concepts.sort();
    }
}

// Function to change True to 'Si' and False to 'No'
const boolToString = (bool) => {
    return bool ? 'Si' : 'No';
}


router.get('/stores', async (req, res) => {
  // Athentication
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized log' });
  }
  const encoded = authorization.substring(6);
  const decoded = Buffer.from(encoded, 'base64').toString('ascii');
  const [username, password] = decoded.split(':'); 
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized username' });
  }
  const matchPassword = user.verifyPassword(password);
  if (!matchPassword) {
    return res.status(401).json({ message: 'Unauthorized password' });
  }

  // Pagination and sorting
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const stores = await Store.find({}).skip(skip).limit(limit);
  
    // map stores to format required 
    const mappedStores = stores.map(store => {
      return {
        id: store._id,
        name: store.name,
        cuit: store.cuit,
        concepts: sortConcepts(store.concepts),
        currentBalance: currencyMeth(store.currentBalance),
        active: boolToString(store.active),
        lastSale: dateShort(store.lastSale)
      }
    }
    );

    // Pagination Structure
    const pagination = {
      data: mappedStores,
      page: page,
      pages: Math.ceil(await Store.countDocuments() / limit),
      limit: limit,
      total: await Store.countDocuments()
    }
    // Return response
    res.json(pagination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/posts', async (req, res) => {
    // Athentication
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized log' });
    }
    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [username, password] = decoded.split(':'); 
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized username' });
    }
    const matchPassword = user.verifyPassword(password);
    if (!matchPassword) {
      return res.status(401).json({ message: 'Unauthorized password' });
    }

    // Complete store creation
    const stores = new Store({
      name: req.body.name,
      cuit: req.body.cuit,
      concepts: req.body.concepts,
      currentBalance: req.body.currentBalance,
      active: req.body.active,
      lastSale: req.body.lastSale
    });
    try {
      const saveStore = await stores.save();
      res.status(201).json(saveStore);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});


// Function that generate ramdom data for testing
function generateRandomData(length) {
  let data = [];
  for (let i = 0; i < length; i++) {
      data.push({
          name: 'Store ' + i,
          cuit: '20' + i,
          concepts: ["concept " + i, "concept " + i + 1, "concept " + i + 2],
          currentBalance: 100 + i,
          active: true,
          lastSale: '2022-05-09'
      });
  }
  return data;
};


// Function that generate ramdom data for testing and save it in mongoDB
function seeders(length) {
  let data = generateRandomData(length);
  for (let i = 0; i < data.length; i++) {
      let store = new Store(data[i]);
      store.save();
  }
};

//seeders(10);


module.exports = router;