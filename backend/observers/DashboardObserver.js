/**
 * DashboardObserver - Concrete Observer for dashboard updates
 * Handles updating dashboard metrics and charts when alerts change
 */
class DashboardObserver {
  constructor() {
    this.name = 'DashboardObserver';
    this.lastUpdate = null;
    this.metrics = {
      totalAlerts: 0,
      criticalAlerts: 0,
      urgentAlerts: 0,
      lowStockAlerts: 0
    };
  }

  /**
   * Update method called by AlertManager when alerts change
   * @param {Array} alerts - Current alert items
   */
  update(alerts) {
    this.lastUpdate = new Date();
    this.updateMetrics(alerts);
    this.updateDashboard(alerts);
  }

  /**
   * Update dashboard metrics based on current alerts
   * @param {Array} alerts - Alert items
   */
  updateMetrics(alerts) {
    this.metrics.totalAlerts = alerts.length;
    
    // Categorize alerts by severity
    this.metrics.criticalAlerts = alerts.filter(item => 
      item.quantity <= (item.reorderLevel * 0.5)
    ).length;

    this.metrics.urgentAlerts = alerts.filter(item => 
      item.quantity <= (item.reorderLevel * 0.8) && item.quantity > (item.reorderLevel * 0.5)
    ).length;

    this.metrics.lowStockAlerts = alerts.filter(item => 
      item.quantity <= item.reorderLevel && item.quantity > (item.reorderLevel * 0.8)
    ).length;

    console.log(`[${this.name}] Dashboard metrics updated:`, this.metrics);
  }

  /**
   * Update dashboard display
   * @param {Array} alerts - Alert items
   */
  updateDashboard(alerts) {
    console.log(`[${this.name}] Updating dashboard with ${alerts.length} alerts`);
    
    // In a real implementation, this would:
    // - Update dashboard charts
    // - Refresh metrics widgets
    // - Update alert counters
    // - Trigger dashboard refresh
    
    this.logDashboardUpdate(alerts);
  }

  /**
   * Log dashboard update for debugging
   * @param {Array} alerts - Alert items
   */
  logDashboardUpdate(alerts) {
    if (alerts.length > 0) {
      console.log('Dashboard Alert Summary:');
      console.log(`  Total Items: ${alerts.length}`);
      console.log(`  Critical: ${this.metrics.criticalAlerts}`);
      console.log(`  Urgent: ${this.metrics.urgentAlerts}`);
      console.log(`  Low Stock: ${this.metrics.lowStockAlerts}`);
      
      // Show top 5 most critical items
      const sortedAlerts = alerts
        .sort((a, b) => (a.quantity / a.reorderLevel) - (b.quantity / b.reorderLevel))
        .slice(0, 5);
      
      console.log('Top 5 Critical Items:');
      sortedAlerts.forEach((item, index) => {
        const percentage = Math.round((item.quantity / item.reorderLevel) * 100);
        console.log(`  ${index + 1}. ${item.name} - ${item.quantity} (${percentage}% of reorder level)`);
      });
    } else {
      console.log('Dashboard: No alerts - All items in stock');
    }
  }

  /**
   * Get current metrics
   * @returns {Object} - Current dashboard metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      lastUpdate: this.lastUpdate,
      isActive: true
    };
  }

  /**
   * Get observer status
   * @returns {Object} - Observer status information
   */
  getStatus() {
    return {
      name: this.name,
      lastUpdate: this.lastUpdate,
      metrics: this.metrics,
      isActive: true
    };
  }
}

module.exports = DashboardObserver;
