const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VocabSchema = new Schema(
    {
  english: {
    type: String,
    },
  german: {
    type: String,
    },
  french: {
    type: String,
  },
  vietnamese: {
    type: String,
  },
},
{ collection: 'vocab' }
);
VocabSchema.pre('save', function (next) {
  const doc = this;
  const filledFields = [doc.english, doc.german, doc.french, doc.vietnamese].filter(Boolean);
  if (filledFields.length < 2) {
    return next(new Error('At least two fields must be filled'));
  }
  next();
});

module.exports = mongoose.model('Vocab', VocabSchema);
