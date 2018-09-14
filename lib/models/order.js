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
    return this.findOrderById(orderId).orderStatus = orderStatus;
  },
  deleteOrder(orderId) {
    return this.orders.splice(this.orders.findIndex(order => order.id === orderId), 1);
  },
};
