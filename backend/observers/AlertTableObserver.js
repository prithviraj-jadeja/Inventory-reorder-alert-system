/**
 * AlertTableObserver - Concrete Observer for table display
 * Handles updating the alert table when alerts change
 */
class AlertTableObserver {
  constructor() {
    this.name = 'AlertTableObserver';
    this.lastUpdate = null;
  }

  /**
   * Update method called by AlertManager when alerts change
   * @param {Array} alerts - Current alert items
   */
  update(alerts) {
    this.lastUpdate = new Date();
    console.log(`[${this.name}] Alert table updated with ${alerts.length} alerts`);
    
    // In a real implementation, this would update the UI
    // For now, we'll just log the changes
    if (alerts.length > 0) {
      console.log('Low stock items:', alerts.map(item => ({
        name: item.name,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel
      })));
    } else {
      console.log('No low stock alerts');
    }
  }

  /**
   * Get observer status
   * @returns {Object} - Observer status information
   */
  getStatus() {
    return {
      name: this.name,
      lastUpdate: this.lastUpdate,
      isActive: true
    };
  }
}

module.exports = AlertTableObserver;
