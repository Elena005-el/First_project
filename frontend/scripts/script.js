document.addEventListener('DOMContentLoaded', function() {
    const orderActionButton = document.getElementById('order-action');
    const loadingIndicator = document.getElementById('loading-indicator');
    const orderForm = document.getElementById('order-form');

    if (!orderActionButton || !loadingIndicator || !orderForm) {
        console.error('Один или несколько элементов не найдены.');
        return;
    }

    orderActionButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        const order = document.getElementById('burger').value.trim();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();

        console.log('Заказ:', order);
        console.log('Имя:', name);
        console.log('Телефон:', phone);

        let errorMessage = '';
        if (!order) errorMessage += 'Поле "Ваш заказ" не может быть пустым.\n';
        if (!name) errorMessage += 'Поле "Ваше имя" не может быть пустым.\n';
        if (!phone) errorMessage += 'Поле "Ваш телефон" не может быть пустым.\n';

        if (errorMessage) {
            alert('Пожалуйста, заполните все поля:\n' + errorMessage);
            return;
        }

        loadingIndicator.style.display = 'block';

        const data = { order, name, phone };

        fetch('http://localhost:3003/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'success') {
                alert('Ваш заказ оформлен!');
                orderForm.reset(); 
            } else {
                alert('Произошла ошибка при оформлении заказа: ' + (result.message || 'Неизвестная ошибка.'));
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            alert('Произошла ошибка при отправке данных: ' + error.message);
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });
    });
});

let prices = document.getElementsByClassName("products-item-price") ;
document.getElementById("change-currency").onclick = function (e) {
   let currentCurrency = e.target.innerText ;

   let newCurrency = "$" ;
   let coefficient = 1 ;
   if (currentCurrency === '$') {
      newCurrency = "₽" ;
      coefficient = 80 ;

   }else if (currentCurrency ===  "₽" ) {
      newCurrency = "BYN" ;
      coefficient = 3 ;

   }
   else if (currentCurrency === 'BYN') {
      newCurrency = '€';
      coefficient = 0.9;
   } else if (currentCurrency === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
   }
   e.target.innerText = newCurrency ;
   for (let i = 0 ;i < prices.length; i++) {
      prices[i].innerText = +(prices[i].getAttribute('data-base-price') * coefficient).toFixed(1) + " " + newCurrency ;
   }


}
