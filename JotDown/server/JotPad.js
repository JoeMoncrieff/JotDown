const {Schema, model} = require('mongoose')

const JotPad = new Schema({
  '_id': String,
  'data': Object,
  'user': String
})

module.exports = model("JotPad",JotPad);
