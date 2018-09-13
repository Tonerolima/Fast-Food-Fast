import uniqId from 'uniqid';
import menu from './menu';

export default {
  orders: [],
  addOrder(foodId, userId) {
    const meal = menu.findMealById(foodId);
    if (!meal) { return undefined; }
    const order = {
      ...meal, userId, id: uniqId(), orderStatus: 'pending',
    };
    this.orders.push(order);
    return order;
  },
  findOrderById(orderId) {
    return this.orders.find(elem => elem.id === orderId);
  },
  getOders(userId) {
    return this.orders.filter(order => order.userId === userId);
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
