const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: String,
  cuit: String,
  concepts: Array,
  currentBalance: Number,
  active: Boolean,
  lastSale: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

StoreSchema.pre('save', async function (callback) {
  /*let store = this;
  store.currentBalance = store.currentBalance ? store.currentBalance : 0;
  store.active = store.active ? true : false;
  callback();*/
});

module.exports = mongoose.model('Store', StoreSchema);
