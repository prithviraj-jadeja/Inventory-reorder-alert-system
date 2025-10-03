const mongoose = require('mongoose');

class ModelFactory {
  static create(modelName) {
    
    if (mongoose.models[modelName]) return mongoose.models[modelName];

    switch (modelName) {
      case 'Item':
        require('./Item'); 
        return mongoose.models.Item;

      default:
        throw new Error(`Unknown model: ${modelName}`);
    }
  }
}

module.exports = ModelFactory;
