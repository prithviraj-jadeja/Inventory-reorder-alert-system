/**
 * NotificationObserver - Concrete Observer for notifications
 * Handles sending notifications when alerts change
 */
class NotificationObserver {
  constructor() {
    this.name = 'NotificationObserver';
    this.lastNotification = null;
    this.notificationCount = 0;
  }

  /**
   * Update method called by AlertManager when alerts change
   * @param {Array} alerts - Current alert items
   */
  update(alerts) {
    this.lastNotification = new Date();
    this.notificationCount++;
    
    console.log(`[${this.name}] Processing ${alerts.length} alerts`);
    
    if (alerts.length > 0) {
      this.sendLowStockNotification(alerts);
    } else {
      console.log('No low stock notifications to send');
    }
  }

  /**
   * Send low stock notification
   * @param {Array} alerts - Alert items
   */
  sendLowStockNotification(alerts) {
    const criticalItems = alerts.filter(item => 
      item.quantity <= (item.reorderLevel * 0.5) // Critical if below 50% of reorder level
    );

    const urgentItems = alerts.filter(item => 
      item.quantity <= (item.reorderLevel * 0.8) && item.quantity > (item.reorderLevel * 0.5)
    );

    const lowItems = alerts.filter(item => 
      item.quantity <= item.reorderLevel && item.quantity > (item.reorderLevel * 0.8)
    );

    // Send different types of notifications based on severity
    if (criticalItems.length > 0) {
      this.sendCriticalAlert(criticalItems);
    }

    if (urgentItems.length > 0) {
      this.sendUrgentAlert(urgentItems);
    }

    if (lowItems.length > 0) {
      this.sendLowStockAlert(lowItems);
    }
  }

  /**
   * Send critical stock alert
   * @param {Array} items - Critical items
   */
  sendCriticalAlert(items) {
    console.log(`🚨 CRITICAL STOCK ALERT: ${items.length} items at critical levels`);
    items.forEach(item => {
      console.log(`   - ${item.name}: ${item.quantity} remaining (reorder at ${item.reorderLevel})`);
    });
    
    // In a real implementation, this would send:
    // - Email notifications
    // - SMS alerts
    // - Dashboard notifications
    // - Slack/Teams messages
  }

  /**
   * Send urgent stock alert
   * @param {Array} items - Urgent items
   */
  sendUrgentAlert(items) {
    console.log(`⚠️ URGENT STOCK ALERT: ${items.length} items need immediate attention`);
    items.forEach(item => {
      console.log(`   - ${item.name}: ${item.quantity} remaining (reorder at ${item.reorderLevel})`);
    });
  }

  /**
   * Send low stock alert
   * @param {Array} items - Low stock items
   */
  sendLowStockAlert(items) {
    console.log(`📢 LOW STOCK ALERT: ${items.length} items below reorder level`);
    items.forEach(item => {
      console.log(`   - ${item.name}: ${item.quantity} remaining (reorder at ${item.reorderLevel})`);
    });
  }

  /**
   * Get notification statistics
   * @returns {Object} - Notification statistics
   */
  getStats() {
    return {
      name: this.name,
      lastNotification: this.lastNotification,
      notificationCount: this.notificationCount,
      isActive: true
    };
  }
}

module.exports = NotificationObserver;
