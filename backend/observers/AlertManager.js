/**
 * AlertManager - Subject in Observer Pattern
 * Manages alert state and notifies observers when alerts change
 */
class AlertManager {
  constructor() {
    this.observers = [];
    this.alerts = [];
    this.alertHistory = [];
  }

  /**
   * Subscribe an observer to receive alert updates
   * @param {Object} observer - Observer object with update method
   */
  subscribe(observer) {
    if (typeof observer.update !== 'function') {
      throw new Error('Observer must have an update method');
    }
    this.observers.push(observer);
    console.log(`Observer subscribed. Total observers: ${this.observers.length}`);
  }

  /**
   * Unsubscribe an observer from alert updates
   * @param {Object} observer - Observer to remove
   */
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
    console.log(`Observer unsubscribed. Total observers: ${this.observers.length}`);
  }

  /**
   * Notify all observers of alert changes
   * @param {Array} alerts - Current alert data
   */
  notify(alerts) {
    this.observers.forEach(observer => {
      try {
        observer.update(alerts);
      } catch (error) {
        console.error('Error notifying observer:', error);
      }
    });
  }

  /**
   * Check for low stock items and update alerts
   * @param {Array} items - Array of inventory items
   */
  checkLowStock(items) {
    const lowStockItems = items.filter(item => 
      item.quantity <= item.reorderLevel
    );

    // Check if alerts have changed
    const alertsChanged = this.hasAlertsChanged(lowStockItems);
    
    if (alertsChanged) {
      this.alerts = lowStockItems;
      this.addToHistory(lowStockItems);
      this.notify(lowStockItems);
    }
  }

  /**
   * Check if alerts have changed compared to previous state
   * @param {Array} newAlerts - New alert items
   * @returns {boolean} - True if alerts have changed
   */
  hasAlertsChanged(newAlerts) {
    if (this.alerts.length !== newAlerts.length) {
      return true;
    }

    // Check if any item IDs are different
    const currentIds = this.alerts.map(item => item._id.toString()).sort();
    const newIds = newAlerts.map(item => item._id.toString()).sort();
    
    return JSON.stringify(currentIds) !== JSON.stringify(newIds);
  }

  /**
   * Add alert state to history for tracking
   * @param {Array} alerts - Alert items to add to history
   */
  addToHistory(alerts) {
    this.alertHistory.push({
      timestamp: new Date(),
      alerts: alerts.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel
      }))
    });

    // Keep only last 100 history entries
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(-100);
    }
  }

  /**
   * Get current alerts
   * @returns {Array} - Current alert items
   */
  getCurrentAlerts() {
    return this.alerts;
  }

  /**
   * Get alert history
   * @returns {Array} - Alert history
   */
  getAlertHistory() {
    return this.alertHistory;
  }

  /**
   * Clear all alerts
   */
  clearAlerts() {
    this.alerts = [];
    this.notify([]);
  }

  /**
   * Get observer count
   * @returns {number} - Number of subscribed observers
   */
  getObserverCount() {
    return this.observers.length;
  }
}

module.exports = AlertManager;
