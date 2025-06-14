const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new mongoose.Schema({
  name: {type: String},
  active: {type: Boolean},
  logo: {type: String},
  objectUrn: {type: String}
});


const dateSchema = new mongoose.Schema({
  start: {},
  end: {} 
});
// Define the schema for the Profile mod

const EventBriteSchema = new mongoose.Schema({
  eventId:{type: String },
  title:{type: String },
  countryString:{type: String },
  fromDate:{type: String },
  toDate:{type: String },
  mainImage:{type: String },
  otherImages: {
    type: [String],
    default: [] 
  },
  locationString : {type: String },
  summary: {type: String },
  category:{type: String },
  paid:{type: Boolean, },
  fromPrice:{type: Number, },
  toPrice:{type: Number, },
  pricesInfo:{
    type: Object 
  }
 

});

// Create the Profile model based on the schema
const Profile = mongoose.model('Profile', EventBriteSchema);

module.exports = Profile;
