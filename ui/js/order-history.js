const list = document.querySelector('.vertical.list');

const getOrders = () => {
    const myInit = { method: 'GET', headers: { Authorization: `Bearer ${localStorage.authToken}` } };
    const request = new Request(`https://fast-food-fast-adc.herokuapp.com/api/v1/users/${localStorage.userId}/orders`, myInit);

    fetch(request)
        .then(response => response.json())
        .catch(error => console.log('Request failed', error))
        .then(response => {
            if (!response.status) { return alert(response.message); }
            let item = '';
            let orders = response.result;
            orders.forEach((order) => {
                item += `<li class="order card ${order.order_status}">
                            <p>Order id: <span>${order.id}</span> </p> |
                            <p>Amount: <span>${order.amount}</span> </p> |
                            <p>Status: <span>${order.order_status}</span> </p>
                        </li>`
            });
            list.innerHTML = item;
        });


    // fetch(`https://fast-food-fast-adc.herokuapp.com/api/v1/menu`)
    //     .then(response => response.json())
    //     .catch(error => console.log('Request failed', error))
    //     .then(response => {
    //         if (!response.status) { return alert(response.message); }
            
    // });
}

getOrders();
