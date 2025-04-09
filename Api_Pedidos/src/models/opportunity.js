const mongoose = require('mongoose');

const SingleOpportunitySchema = new mongoose.Schema({
  title: String,
  value: Number,
  won_time: Date,
  person_name: String, // antes era "client_name"
}, { _id: false }); // desabilita _id interno do subdocumento

const OpportunitySchema = new mongoose.Schema({
  date: {
    type: String, // formato "YYYY-MM-DD"
    required: true
  },
  totalValue: {
    type: Number,
    default: 0
  },
  opportunities: {
    type: [SingleOpportunitySchema],
    default: []
  }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
