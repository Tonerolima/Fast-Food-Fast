import uniqId from 'uniqid';
import menu from './menu';

export default {
  orders: [],
  addOrder(foodId) {
    const meal = menu.findMealById(foodId);
    if (!meal) { return undefined; }
    const order = { ...meal, id: uniqId(), orderStatus: 'new' };
    this.orders.push(order);
    return order;
  },
  findOrderById(orderId) {
    const order = this.orders.find(elem => elem.id === orderId);
    if (!order) { return undefined; }
    return order;
  },
  getOders() {
    return this.orders;
  },
  updateOrderStatus(orderId, orderStatus) {
    const order = this.findOrderById(orderId);
    if (!order) { return undefined; }
    order.orderStatus = orderStatus;
    return order;
  },
  deleteOrder(orderId) {
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index < 0) { return undefined; }
    return this.orders.splice(index, 1);
  },
};
