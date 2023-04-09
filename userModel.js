const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3,
    max: 20
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 1000
  },
  date: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3
  },
  role: {
    type: String,
    required: true,
    trim: true,
    default: "user",
    enum: ["user", "admin"]
  },
  token_valid: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('pokeusers', schema) //pokeUser is the name of the collection in the db





