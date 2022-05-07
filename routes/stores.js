const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

router.route('/stores')
  .get(function(){logger.info("pending validations")}, function(){logger.info("pending use case")});

/*router.get('/posts', (req, res) => {
  res.send('Hello Post GET!');
});

router.post('/posts', (req, res) => {
  console.log(req.body);
  res.send('Hello Post POST!');
});
*/
router.get('/posts', async (req, res) => {
    try {
      const stores = await Store.find({});
      res.json(stores);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.post('/posts', async (req, res) => {
    const post = new Store({
      name: req.body.name,
      cuit: req.body.cuit,
      concepts: req.body.concepts,
      currentBalance: req.body.currentBalance,
      active: req.body.active,
      lastSale: req.body.lastSale
    });
    try {
      const saveStore = await post.save();
      res.status(201).json(saveStore);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

module.exports = router;
