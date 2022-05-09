const mongoose = require('mongoose');

// Store Schema to check the body of the request
const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cuit: {
    type: String,
    required: true
  },
  concepts: {
    type: Array,
    required: true
  },
  currentBalance: Number,
  active: Boolean,
  lastSale: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

StoreSchema.pre('save', async function (callback) {
  let store = this;
  store.currentBalance = store.currentBalance ? store.currentBalance : 0;
  store.active = store.active ? true : false;
  callback();
});

module.exports = mongoose.model('Store', StoreSchema);
