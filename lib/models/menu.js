export default {
  dishes: [
    {
      name: 'Jollof Rice',
      cost: 1500,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnUqzH59_6q1KUqc7-w6arwNbw9MMrrswfFYVh3vE9aSpvw6q1',
      id: 'eexbt1qvjlm5nj37',
    },
    {
      name: 'Ofada Rice',
      cost: 2000,
      image: 'https://i0.wp.com/myactivekitchen.com/wp-content/uploads/2016/12/ofada-stew-10.jpg?resize=750%2C500',
      id: 'eexbt1qvjlm5nj38',
    },
    {
      name: 'Spaghetti',
      cost: 1200,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx8gtSyqFNAYH-Xpkea3W33g4lov95EDg103oXgQOMRdB8Okyo_Q',
      id: 'eexbt1qvjlm5nj39',
    },
    {
      name: 'Ewa Agoyin',
      cost: 500,
      image: 'https://s3.amazonaws.com/www.dealdey.com/system/photos/files/112060/S670x414/IB4279_Blueshell_cakes-5-products.jpg',
      id: 'eexbt1qvjlm5nj3a',
    },
    {
      name: 'Yam Porridge',
      cost: 1500,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDdKUntB-h6FyEKBuKw9gNTZzhT7L2ftaFCH3LJPxL7Wdmsb65dA',
      id: 'eexbt1qvjlm5nj3b',
    },
    {
      name: 'Pounded Yam & Egusi',
      cost: 3000,
      image: 'https://4.bp.blogspot.com/-kg-YfEE3FY8/WsA6uqgpPXI/AAAAAAAAFnU/p1bFPg5UEBUpIiteiN1xB73jcx39KZMGACLcBGAs/s1600/Buka-11.jpg',
      id: 'eexbt1qvjlm5q6ul',
    },
    {
      name: 'Asun',
      cost: 700,
      image: 'https://i.ytimg.com/vi/ez_N5ArYkA0/maxresdefault.jpg',
      id: 'eexbt1qvjlm5nj3d',
    },
    {
      name: 'Nkwobi',
      cost: 700,
      image: 'https://i2.wp.com/www.1qfoodplatter.com/wp-content/uploads/2015/11/nkwobi-recipe.jpg?fit=400%2C266&ssl=1',
      id: 'eexbt1qvjlm5nj3e',
    },
  ],
  findMealById(id) {
    const meal = this.dishes.find(food => food.id === id);
    if (!meal) { return undefined; }
    const copy = { ...meal };
    return copy;
  },
  getMeals(offset = 0, limit = 10, search = '') {
    offset = Number(offset);
    limit = Number(limit);
    const result = this.dishes.filter(food => food.name.toLowerCase()
      .includes(search.toLowerCase()));
    return result.slice(offset, offset + limit);
  },
};
