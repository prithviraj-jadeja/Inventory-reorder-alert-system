// backend/patterns/AlertStrategy.js
class AlertStrategy {
    check(item) { throw new Error('The check() method must be implemented.'); }
  }
  
  class ThresholdAlertStrategy extends AlertStrategy {
    check(item) {
      if (item.quantity <= 0) return 'Out of Stock';
      if (item.quantity <= item.reorderLevel * 0.5) return 'Critical';
      if (item.quantity <= item.reorderLevel) return 'Low Stock';
      return 'In Stock';
    }
  }
  
  class AlertContext {
    constructor(strategy) { this._strategy = strategy; }
    setStrategy(strategy) { this._strategy = strategy; }
    evaluate(item) { return this._strategy.check(item); }
  }
  
  module.exports = { AlertContext, ThresholdAlertStrategy };