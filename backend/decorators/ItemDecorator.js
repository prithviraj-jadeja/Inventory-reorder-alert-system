// Decorator base class for Item
class ItemDecorator {
  constructor(item) {
    this.item = item;
  }
  getDeliveryDate(orderDate = new Date()) {
    return this.item.calculateDeliveryDate(orderDate);
  }
  // Extend with more features as needed
}

// DeliveryDateDecorator adds delivery date calculation
class DeliveryDateDecorator extends ItemDecorator {
  getDeliveryDate(orderDate = new Date()) {
    // Decorate with custom logic if needed
    return super.getDeliveryDate(orderDate);
  }
}

// CalendarEventDecorator adds calendar event creation
class CalendarEventDecorator extends ItemDecorator {
  getCalendarEvent() {
    const deliveryDate = this.getDeliveryDate();
    return {
      id: this.item._id,
      title: `${this.item.name} - Delivery`,
      start: deliveryDate,
      leadTime: this.item.leadTime,
      supplier: this.item.supplier?.name || 'N/A',
    };
  }
}

module.exports = {
  ItemDecorator,
  DeliveryDateDecorator,
  CalendarEventDecorator
};
