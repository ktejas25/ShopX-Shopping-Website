document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const orderDetailsDiv = document.getElementById('orderDetails');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];

    const cardNumberInput = document.getElementById('cardNumber');

    // Format card number with dashes on input
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '').substring(0,16);
        const formattedValue = value.match(/.{1,4}/g);
        e.target.value = formattedValue ? formattedValue.join('-') : value;
    });

    // Function to display order summary on the payment page
    function displayOrderDetails() {
        if (!cart.length) {
            orderDetailsDiv.innerHTML = "<p>No products in the cart.</p>";
            return;
        }

        orderDetailsDiv.innerHTML = `<h2>Order Summary</h2>`;
        let total = 0;

        cart.forEach(item => {
            // Find matching product by id
            const product = products.find(p => p.id == item.id);
            if (!product) return;

            const subtotal = product.price * item.quantity;
            total += subtotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-item');
            itemDiv.innerHTML = `
                <div class="order-item-name">
                    ${product.name} (x${item.quantity})
                </div>
                <div>Rs ${subtotal.toFixed(2)}</div>
            `;
            orderDetailsDiv.appendChild(itemDiv);
        });

        const totalDiv = document.createElement('div');
        totalDiv.classList.add('order-total');
        totalDiv.textContent = `Total: Rs ${total.toFixed(2)}`;
        orderDetailsDiv.appendChild(totalDiv);
    }

    // Fetch products, then display order summary
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            products = data;
            displayOrderDetails();
        })
        .catch(() => {
            orderDetailsDiv.innerHTML = "<p>Failed to load product data.</p>";
        });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let allFilled = true;
        const requiredFields = form.querySelectorAll('input[required], select[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                allFilled = false;
            } else {
                field.style.borderColor = '#ccc';
            }
        });

        if (!allFilled) {
            alert('Please fill in all required fields.');
            return;
        }

        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        // Calculate order details and save order data
        let total = 0;
        const items = cart.map(item => {
            const product = products.find(p => p.id == item.id);
            if (!product) return null;
            const subtotal = product.price * item.quantity;
            total += subtotal;
            return {
                id: product.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
            };
        }).filter(i => i !== null);

        // Prepare order data
        const orderData = {
            orderNumber: 'OD' + Math.floor(Math.random() * 1000000),
            orderDate: new Date().toLocaleDateString(),
            deliveryDate: new Date(Date.now() + 5 * 86400000).toLocaleDateString(), // 5 days from now
            status: 'Processing',
            customer: {
                fullname: form.fullname.value,
                email: form.email.value,
                address: form.address.value,
                city: form.city.value,
                state: form.state.value,
                zip: form.zip.value,
            },
            paymentMethod: '****-****-****-' + form.cardNumber.value.slice(-4),
            items: items,
            total: total,
        };

        // Save order data to localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));

        alert('✅ Order Placed Successfully!');

        // Clear cart after order
        localStorage.removeItem('cart');

        // Redirect to order confirmation page
        window.location.href = 'orderconfirmation.html';
    });
});



function submitPayment(details) {
    fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            sendOrderItems(data.orderId);
        }
    });
}

function sendOrderItems(orderId) {
    const items = getCartFromLocalStorage();
    fetch("/api/order-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, items })
    });
}
