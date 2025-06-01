document.addEventListener('DOMContentLoaded', () => {
  const orderDetailsContainer = document.getElementById('orderDetails');
  const customerInfoContainer = document.getElementById('customerInfo');
  const orderIdElem = document.getElementById('orderId');
  const orderDateElem = document.getElementById('orderDate');
  const deliveryDateElem = document.getElementById('deliveryDate');

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const paymentDetails = JSON.parse(localStorage.getItem('paymentDetails'));

  if (!paymentDetails || cart.length === 0) {
    orderDetailsContainer.innerHTML = "<p>Missing order details. Please complete your purchase first.</p>";
    return;
  }

  // Generate unique order ID and date
  const orderId = 'ODR' + Math.floor(Math.random() * 1000000);
  const orderDate = new Date();
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 5); // 5 days delivery estimate

  orderIdElem.textContent = orderId;
  orderDateElem.textContent = orderDate.toDateString();
  deliveryDateElem.textContent = deliveryDate.toDateString();

  // Display customer info
  customerInfoContainer.innerHTML = `
    <p><strong>Name:</strong> ${paymentDetails.fullname}</p>
    <p><strong>Email:</strong> ${paymentDetails.email}</p>
    <p><strong>Shipping Address:</strong> ${paymentDetails.address}, ${paymentDetails.city}, ${paymentDetails.state} - ${paymentDetails.zip}</p>
    <p><strong>Payment Method:</strong> ${paymentDetails.cardname} (•••• ${paymentDetails.cardnumber.slice(-4)})</p>
  `;

  // Load product data and display summary
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      let total = 0;
      orderDetailsContainer.innerHTML = '<h2>Ordered Items</h2>';

      cart.forEach(item => {
        const product = products.find(p => p.id == item.id);
        if (!product) return;

        const subtotal = product.price * item.quantity;
        total += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');
        itemDiv.innerHTML = `
          <div class="order-item-name">${product.name} (x${item.quantity})</div>
          <div>Rs ${subtotal.toFixed(2)}</div>
        `;
        orderDetailsContainer.appendChild(itemDiv);
      });

      const totalDiv = document.createElement('div');
      totalDiv.classList.add('order-total');
      totalDiv.textContent = `Total: Rs ${total.toFixed(2)}`;
      orderDetailsContainer.appendChild(totalDiv);
    });

  // Save order summary to localStorage for shippingstatus.html
  const shippingData = {
    name: paymentDetails.fullname,
    address: `${paymentDetails.address}, ${paymentDetails.city}, ${paymentDetails.state} - ${paymentDetails.zip}`,
    orderId: orderId,
    status: 'Shipped'  // initial status
  };

  localStorage.setItem('orderConfirmation', JSON.stringify(shippingData));
  localStorage.removeItem('cart');
});
