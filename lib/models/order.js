import menu from './menu';
import uniqId from 'uniqid';

export default {
  orders: [],
  addOrder(foodId) {
    let meal = menu.findMealById(foodId);
    if (!meal) { return undefined }
    let order = {...order, id: uniqId(), status: 'pending'};
    this.orders.push(order);
    return order;
  },
  findOrderById(orderId) {
    let order = this.orders.find(order => order.id === orderId);
    if (!order) { return undefined }
    return order;
  },
  getOders() {
    return this.orders;
  },
  updateOrderStatus(orderId, orderStatus) {
    let order = this.findOrderById(orderId);
    if (!order) { return undefined }
    order.orderStatus = orderStatus;
    return order;
  },
  deleteOrder(orderId) {
    let index = this.orders.findIndex(order => order.id === orderId);
    if (index < 0) { return undefined }
    return this.orders.splice(index, 1);
  }
};