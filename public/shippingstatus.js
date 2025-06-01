document.addEventListener('DOMContentLoaded', () => {
  // Dummy user & order data (you can replace this with localStorage/sessionStorage)
  const orderData = JSON.parse(localStorage.getItem('orderConfirmation')) || {
    name: 'John Doe',
    address: '123 Street, City, State, 12345',
    orderId: 'ODR' + Math.floor(Math.random() * 1000000),
    status: 'Out for Delivery'  // or 'Delivered'
  };

  document.getElementById('name').textContent = orderData.name;
  document.getElementById('address').textContent = orderData.address;
  document.getElementById('orderId').textContent = orderData.orderId;

  const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  let currentStep = steps.indexOf(orderData.status);

  for (let i = 0; i <= currentStep; i++) {
    document.getElementById(`step${i + 1}`).classList.add('completed');
  }

  document.getElementById('statusMessage').textContent = `Current Status: ${orderData.status}`;
});
