// =====================================================
// FRESHBITE - MAIN JAVASCRIPT
// =====================================================


// =====================================================
// FOOD DATA
// =====================================================

const foodItems = [

    {
        id: 1,
        name: "Margherita Pizza",
        price: 299,
        category: "Pizza",
        description: "Fresh tomatoes, mozzarella and basil.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
        veg: true
    },

    {
        id: 2,
        name: "Classic Burger",
        price: 199,
        category: "Burger",
        description: "Juicy burger with fresh vegetables.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        veg: false
    },

    {
        id: 3,
        name: "Chocolate Dessert",
        price: 149,
        category: "Dessert",
        description: "Rich and delicious chocolate dessert.",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
        veg: true
    },

    {
        id: 4,
        name: "Paneer Tikka",
        price: 249,
        category: "Indian",
        description: "Soft paneer with aromatic Indian spices.",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
        veg: true
    },

    {
        id: 5,
        name: "Pepperoni Pizza",
        price: 349,
        category: "Pizza",
        description: "Cheesy pizza topped with pepperoni.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
        veg: false
    },

    {
        id: 6,
        name: "Chicken Burger",
        price: 229,
        category: "Burger",
        description: "Crispy chicken with fresh lettuce and sauce.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80",
        veg: false
    }

];


// =====================================================
// CART
// =====================================================

let cart =
    JSON.parse(
        localStorage.getItem("freshBiteCart")
    ) || [];

if (!Array.isArray(cart)) {
    cart = [];
}


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

    localStorage.setItem(
        "freshBiteCart",
        JSON.stringify(cart)
    );

}


// =====================================================
// DISPLAY FOOD - HOME PAGE
// =====================================================

function displayFood(items = foodItems) {

    const container =
        document.getElementById("food-container");

    if (!container) return;

    container.innerHTML = "";

    if (items.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h2>No food found 😔</h2>
                <p>Please try another category.</p>
            </div>
        `;

        return;
    }

    items.forEach(food => {

        container.innerHTML += `

            <div class="food-card">

                <img
                    src="${food.image}"
                    alt="${food.name}"
                >

                <div class="food-info">

                    <h3>${food.name}</h3>

                    <p>
                        ${food.description}
                    </p>

                    <span class="food-tag">
                        ${food.veg ? "🟢 Veg" : "🔴 Non-Veg"}
                    </span>

                    <strong>
                        ₹${food.price}
                    </strong>

                    <button
                        onclick="addToCart(${food.id})"
                    >
                        Add to Cart 🛒
                    </button>

                </div>

            </div>

        `;

    });

}


// =====================================================
// HOME PAGE FILTER
// =====================================================

function filterFood(category) {

    if (category === "All") {

        displayFood(foodItems);

        return;
    }

    const filteredFood =
        foodItems.filter(
            food => food.category === category
        );

    displayFood(filteredFood);

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(id) {

    const food =
        foodItems.find(
            item => item.id === id
        );

    if (!food) return;

    const existingItem =
        cart.find(
            item => item.id === id
        );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...food,
            quantity: 1
        });

    }

    saveCart();

    updateCartCount();

    alert(
        `${food.name} added to cart! 🛒`
    );

}


// =====================================================
// CART COUNT
// =====================================================

function updateCartCount() {

    const countElement =
        document.getElementById("cart-count");

    if (!countElement) return;

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    countElement.textContent = totalItems;

}


// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const container =
        document.getElementById("cart-items");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty 🛒
                </h2>

                <p>
                    Add some delicious food from our menu.
                </p>

                <br>

                <a
                    href="index.html#menu"
                    class="btn"
                >
                    Explore Menu
                </a>

            </div>

        `;

        updateCartSummary();

        return;
    }


    cart.forEach(item => {

        container.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price} each
                    </p>

                </div>


                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>


                <strong>
                    ₹${item.price * item.quantity}
                </strong>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})"
                >
                    Remove
                </button>

            </div>

        `;

    });

    updateCartSummary();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(id, change) {

    const item =
        cart.find(
            item => item.id === id
        );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }

    saveCart();

    displayCart();

    updateCartCount();

}


// =====================================================
// REMOVE FROM CART
// =====================================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

    displayCart();

    updateCartCount();

}


// =====================================================
// CART SUMMARY
// =====================================================

function calculateSubtotal() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

}


function updateCartSummary() {

    const subtotalElement =
        document.getElementById("subtotal");

    const totalElement =
        document.getElementById("total");

    if (!subtotalElement || !totalElement) {
        return;
    }

    const subtotal =
        calculateSubtotal();

    const deliveryFee =
        subtotal > 0 ? 40 : 0;

    const total =
        subtotal + deliveryFee;

    subtotalElement.textContent =
        subtotal;

    totalElement.textContent =
        total;

}


// =====================================================
// GO TO CHECKOUT
// =====================================================

function goToCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;
    }

    saveCart();

    window.location.href =
        "checkout.html";

}


// =====================================================
// DISPLAY CHECKOUT
// =====================================================

function displayCheckout() {

    const container =
        document.getElementById(
            "checkout-items"
        );

    if (!container) return;


    const savedCart =
        JSON.parse(
            localStorage.getItem(
                "freshBiteCart"
            )
        ) || [];


    cart =
        Array.isArray(savedCart)
            ? savedCart
            : [];


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <p>
                Your cart is empty.
            </p>

            <a
                href="index.html#menu"
                class="btn"
            >
                Go to Menu
            </a>

        `;

        updateCheckoutTotal();

        return;
    }


    cart.forEach(item => {

        container.innerHTML += `

            <div class="checkout-item">

                <div>

                    <div class="checkout-item-name">
                        ${item.name}
                    </div>

                    <div class="checkout-item-quantity">
                        Quantity: ${item.quantity}
                    </div>

                </div>

                <strong>
                    ₹${item.price * item.quantity}
                </strong>

            </div>

        `;

    });


    updateCheckoutTotal();

}


// =====================================================
// CHECKOUT TOTAL
// =====================================================

function updateCheckoutTotal() {

    const subtotalElement =
        document.getElementById(
            "checkout-subtotal"
        );

    const totalElement =
        document.getElementById(
            "checkout-total"
        );

    if (!subtotalElement || !totalElement) {
        return;
    }


    const subtotal =
        calculateSubtotal();

    const deliveryFee =
        subtotal > 0 ? 40 : 0;

    const total =
        subtotal + deliveryFee;


    subtotalElement.textContent =
        subtotal;

    totalElement.textContent =
        total;

}


// =====================================================
// PLACE ORDER
// =====================================================

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;
    }


    const nameElement =
        document.getElementById(
            "customer-name"
        );

    const phoneElement =
        document.getElementById(
            "customer-phone"
        );

    const addressElement =
        document.getElementById(
            "customer-address"
        );

    const deliveryElement =
        document.getElementById(
            "delivery-time"
        );


    if (
        !nameElement ||
        !phoneElement ||
        !addressElement ||
        !deliveryElement
    ) {
        return;
    }


    const name =
        nameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const address =
        addressElement.value.trim();

    const deliveryTime =
        deliveryElement.value;


    const paymentElement =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!paymentElement) {

        alert(
            "Please select a payment method."
        );

        return;
    }


    const payment =
        paymentElement.value;


    const subtotal =
        calculateSubtotal();

    const deliveryFee =
        subtotal > 0 ? 40 : 0;

    const total =
        subtotal + deliveryFee;


    const orderId =
        "FB" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    const newOrder = {

        orderId,

        name,

        phone,

        address,

        deliveryTime,

        payment,

        items: cart.map(item => ({

            name: item.name,

            price: item.price,

            quantity: item.quantity

        })),

        subtotal,

        deliveryFee,

        total,

        date:
            new Date().toLocaleString(),

        status:
            "Order Placed"

    };


    let orders =
        JSON.parse(
            localStorage.getItem(
                "freshBiteOrders"
            )
        ) || [];


    if (!Array.isArray(orders)) {
        orders = [];
    }


    orders.push(newOrder);


    localStorage.setItem(
        "freshBiteOrders",
        JSON.stringify(orders)
    );


    cart = [];

    saveCart();

    updateCartCount();


    const checkoutSection =
        document.querySelector(
            ".checkout-section"
        );


    if (!checkoutSection) {
        return;
    }


    checkoutSection.innerHTML = `

        <div class="order-success">

            <div class="order-icon">
                🎉
            </div>

            <h2>
                Order Placed Successfully!
            </h2>

            <p>
                Thank you, ${name}!
            </p>

            <p>
                Your Order ID is
                <strong>
                    #${orderId}
                </strong>
            </p>

            <p>
                Payment Method:
                <strong>
                    ${payment}
                </strong>
            </p>

            <p>
                Total Amount:
                <strong>
                    ₹${total}
                </strong>
            </p>

            <p>
                Your delicious food will
                be delivered soon. 🍕
            </p>

            <div style="margin-top:25px;">

                <a
                    href="orders.html"
                    class="btn"
                >
                    View My Orders
                </a>

                <a
                    href="index.html"
                    class="btn secondary-btn"
                >
                    Back to Home
                </a>

            </div>

        </div>

    `;

}


// =====================================================
// REGISTER
// =====================================================

function showRegister() {

    const registerBox =
        document.getElementById(
            "register-box"
        );

    if (!registerBox) return;

    registerBox.style.display =
        "block";

    registerBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================================
// REGISTER FORM
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const registerForm =
            document.getElementById(
                "register-form"
            );

        if (!registerForm) return;


        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "register-name"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "register-email"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "register-password"
                    ).value;


                const confirmPassword =
                    document.getElementById(
                        "confirm-password"
                    ).value;


                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Passwords do not match!"
                    );

                    return;
                }


                const user = {

                    name,

                    email,

                    password

                };


                localStorage.setItem(
                    "freshBiteUser",
                    JSON.stringify(user)
                );


                alert(
                    `Account created successfully! 🎉

Welcome to FreshBite, ${name}!`
                );


                registerForm.reset();

            }
        );

    }
);


// =====================================================
// USER LOGIN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "login-form"
            );

        if (!loginForm) return;


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "login-email"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "login-password"
                    ).value;


                const savedUser =
                    JSON.parse(
                        localStorage.getItem(
                            "freshBiteUser"
                        )
                    );


                if (!savedUser) {

                    alert(
                        "No account found. Please create an account first."
                    );

                    return;
                }


                if (
                    email === savedUser.email &&
                    password === savedUser.password
                ) {

                    localStorage.setItem(
                        "freshBiteLoggedIn",
                        "true"
                    );


                    alert(
                        `Login successful! 🎉

Welcome back, ${savedUser.name}!`
                    );


                    window.location.href =
                        "index.html";

                } else {

                    alert(
                        "Invalid email or password. Please try again."
                    );

                }

            }
        );

    }
);


// =====================================================
// USER WELCOME + LOGOUT
// =====================================================

function updateUserDisplay() {

    const userWelcome =
        document.getElementById(
            "user-welcome"
        );

    const logoutLink =
        document.getElementById(
            "logout-link"
        );


    const savedUser =
        JSON.parse(
            localStorage.getItem(
                "freshBiteUser"
            )
        );


    const isLoggedIn =
        localStorage.getItem(
            "freshBiteLoggedIn"
        );


    if (
        userWelcome &&
        savedUser &&
        isLoggedIn === "true"
    ) {

        userWelcome.textContent =
            `Welcome, ${savedUser.name} 👋`;

    }


    if (
        logoutLink &&
        isLoggedIn === "true"
    ) {

        logoutLink.style.display =
            "inline";

    }

}


function logoutUser(event) {

    if (event) {
        event.preventDefault();
    }

    localStorage.removeItem(
        "freshBiteLoggedIn"
    );

    window.location.href =
        "index.html";

}


// =====================================================
// DISPLAY MY ORDERS
// =====================================================

function displayOrders() {

    const container =
        document.getElementById(
            "orders-container"
        );

    if (!container) return;


    const orders =
        JSON.parse(
            localStorage.getItem(
                "freshBiteOrders"
            )
        ) || [];


    container.innerHTML = "";


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    No Orders Yet 📦
                </h2>

                <p>
                    You haven't placed any orders yet.
                </p>

                <br>

                <a
                    href="index.html#menu"
                    class="btn"
                >
                    Explore Menu 🍕
                </a>

            </div>

        `;

        return;
    }


    [...orders]
        .reverse()
        .forEach(order => {

            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `

                    <div class="checkout-item">

                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <div class="checkout-item-quantity">
                                Quantity: ${item.quantity}
                            </div>

                        </div>

                        <strong>
                            ₹${item.price * item.quantity}
                        </strong>

                    </div>

                `;

            });


            container.innerHTML += `

                <div class="order-success">

                    <h2>
                        📦 Order #${order.orderId}
                    </h2>

                    <p>
                        <strong>Status:</strong>
                        ${order.status}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${order.date}
                    </p>

                    <hr>

                    <h3>
                        Items
                    </h3>

                    ${itemsHTML}

                    <hr>

                    <p>
                        <strong>Payment:</strong>
                        ${order.payment}
                    </p>

                    <p>
                        <strong>Subtotal:</strong>
                        ₹${order.subtotal}
                    </p>

                    <p>
                        <strong>Delivery Fee:</strong>
                        ₹${order.deliveryFee}
                    </p>

                    <h2>
                        Total: ₹${order.total}
                    </h2>

                </div>

            `;

        });

}


// =====================================================
// ADMIN LOGIN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const adminLoginForm =
            document.getElementById(
                "admin-login-form"
            );

        if (!adminLoginForm) return;


        adminLoginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "admin-email"
                    ).value.trim();


                const password =
                    document.getElementById(
                        "admin-password"
                    ).value;


                const adminEmail =
                    "admin@freshbite.com";


                const adminPassword =
                    "admin123";


                if (
                    email === adminEmail &&
                    password === adminPassword
                ) {

                    localStorage.setItem(
                        "freshBiteAdminLoggedIn",
                        "true"
                    );


                    alert(
                        "Admin login successful! 🎉"
                    );


                    window.location.href =
                        "admin.html";

                } else {

                    alert(
                        "Invalid admin email or password."
                    );

                }

            }
        );

    }
);


// =====================================================
// CHECK ADMIN LOGIN
// =====================================================

function checkAdminLogin() {

    const adminLoggedIn =
        localStorage.getItem(
            "freshBiteAdminLoggedIn"
        );


    if (
        adminLoggedIn !== "true"
    ) {

        alert(
            "Please login as admin first."
        );


        window.location.href =
            "admin-login.html";


        return false;
    }


    return true;

}


// =====================================================
// ADMIN LOGOUT
// =====================================================

function adminLogout() {

    localStorage.removeItem(
        "freshBiteAdminLoggedIn"
    );

    window.location.href =
        "admin-login.html";

}


// =====================================================
// CREATE ADMIN ORDER HTML
// =====================================================

function createAdminOrderHTML(order) {

    let itemsHTML = "";


    order.items.forEach(item => {

        itemsHTML += `

            <div class="checkout-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <strong>
                    ₹${item.price * item.quantity}
                </strong>

            </div>

        `;

    });


    const status =
        order.status ||
        "Order Placed";


    const isDisabled =
        status === "Delivered" ||
        status === "Cancelled";


    return `

        <div class="order-success">

            <h2>
                📦 Order #${order.orderId}
            </h2>

            <p>
                <strong>Customer:</strong>
                ${order.name}
            </p>

            <p>
                <strong>Phone:</strong>
                ${order.phone}
            </p>

            <p>
                <strong>Address:</strong>
                ${order.address}
            </p>

            <p>
                <strong>Delivery Time:</strong>
                ${order.deliveryTime || "Not specified"}
            </p>

            <p>
                <strong>Date:</strong>
                ${order.date}
            </p>

            <p>

                <strong>Status:</strong>

                <span class="admin-status">
                    ${status}
                </span>

            </p>

            <hr>

            <h3>
                Items
            </h3>

            ${itemsHTML}

            <hr>

            <p>
                <strong>Payment:</strong>
                ${order.payment}
            </p>

            <p>
                <strong>Subtotal:</strong>
                ₹${order.subtotal}
            </p>

            <p>
                <strong>Delivery Fee:</strong>
                ₹${order.deliveryFee}
            </p>

            <h2>
                Total: ₹${order.total}
            </h2>


            <div class="status-buttons">

                <button
                    onclick="updateOrderStatus(
                        '${order.orderId}',
                        'Order Placed'
                    )"
                    ${status === "Order Placed" ? "disabled" : ""}
                >
                    📦 Order Placed
                </button>


                <button
                    onclick="updateOrderStatus(
                        '${order.orderId}',
                        'Preparing'
                    )"
                    ${status === "Preparing" ? "disabled" : ""}
                >
                    👨‍🍳 Preparing
                </button>


                <button
                    onclick="updateOrderStatus(
                        '${order.orderId}',
                        'Out for Delivery'
                    )"
                    ${status === "Out for Delivery" ? "disabled" : ""}
                >
                    🛵 Out for Delivery
                </button>


                <button
                    onclick="updateOrderStatus(
                        '${order.orderId}',
                        'Delivered'
                    )"
                    ${status === "Delivered" ? "disabled" : ""}
                >
                    ✅ Delivered
                </button>


                <button
                    onclick="cancelOrder('${order.orderId}')"
                    ${isDisabled ? "disabled" : ""}
                >
                    ❌ Cancel Order
                </button>

            </div>

        </div>

    `;

}


// =====================================================
// ADMIN DASHBOARD
// =====================================================

function displayAdminOrders() {

    const container =
        document.getElementById(
            "admin-orders-container"
        );


    if (!container) return;


    if (!checkAdminLogin()) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem(
                "freshBiteOrders"
            )
        ) || [];


    const totalOrdersElement =
        document.getElementById(
            "total-orders"
        );


    const totalSalesElement =
        document.getElementById(
            "total-sales"
        );


    const activeOrdersElement =
        document.getElementById(
            "active-orders"
        );


    if (totalOrdersElement) {

        totalOrdersElement.textContent =
            orders.length;

    }


    const totalSales =
        orders.reduce(
            (total, order) =>
                total +
                Number(order.total || 0),
            0
        );


    if (totalSalesElement) {

        totalSalesElement.textContent =
            totalSales;

    }


    const activeOrders =
        orders.filter(
            order =>
                order.status !== "Delivered" &&
                order.status !== "Cancelled"
        );


    if (activeOrdersElement) {

        activeOrdersElement.textContent =
            activeOrders.length;

    }


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    No Orders Yet 📦
                </h2>

                <p>
                    There are no customer orders yet.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    [...orders]
        .reverse()
        .forEach(order => {

            container.innerHTML +=
                createAdminOrderHTML(order);

        });

}


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

function updateOrderStatus(
    orderId,
    newStatus
) {

    let orders =
        JSON.parse(
            localStorage.getItem(
                "freshBiteOrders"
            )
        ) || [];


    const order =
        orders.find(
            order =>
                order.orderId === orderId
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;
    }


    order.status =
        newStatus;


    localStorage.setItem(
        "freshBiteOrders",
        JSON.stringify(orders)
    );


    displayAdminOrders();


    alert(
        `Order #${orderId} status updated to "${newStatus}" ✅`
    );

}


// =====================================================
// SEARCH ORDERS
// =====================================================

function searchOrders() {

    const searchInput =
        document.getElementById(
            "order-search"
        );


    if (!searchInput) return;


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const orders =
        JSON.parse(
            localStorage.getItem(
                "freshBiteOrders"
            )
        ) || [];


    if (searchText === "") {

        displayAdminOrders();

        return;
    }


    const filteredOrders =
        orders.filter(order => {

            const orderId =
                String(
                    order.orderId || ""
                ).toLowerCase();


            const name =
                String(
                    order.name || ""
                ).toLowerCase();


            const phone =
                String(
                    order.phone || ""
                ).toLowerCase();


            return (
                orderId.includes(searchText) ||
                name.includes(searchText) ||
                phone.includes(searchText)
            );

        });


    displayFilteredOrders(
        filteredOrders
    );

}


// =====================================================
// DISPLAY FILTERED ORDERS
// =====================================================

function displayFilteredOrders(
    orders
) {

    const container =
        document.getElementById(
            "admin-orders-container"
        );


    if (!container) return;


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    No Orders Found 🔍
                </h2>

                <p>
                    Try searching with another
                    order ID, name or phone number.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    [...orders]
        .reverse()
        .forEach(order => {

            container.innerHTML +=
                createAdminOrderHTML(order);

        });

}


// =====================================================
// CANCEL ORDER
// =====================================================

function cancelOrder(orderId) {

    let orders =
        JSON.parse(
            localStorage.getItem(
                "freshBiteOrders"
            )
        ) || [];


    const order =
        orders.find(
            order =>
                order.orderId === orderId
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;
    }


    if (
        order.status === "Delivered" ||
        order.status === "Cancelled"
    ) {

        return;
    }


    const confirmCancel =
        confirm(
            `Are you sure you want to cancel Order #${orderId}?`
        );


    if (!confirmCancel) {
        return;
    }


    order.status =
        "Cancelled";


    localStorage.setItem(
        "freshBiteOrders",
        JSON.stringify(orders)
    );


    alert(
        "Order cancelled successfully! ❌"
    );


    displayAdminOrders();

}


// =====================================================
// ADMIN LOGOUT BUTTON
// =====================================================

function addAdminLogoutButton() {

    const adminNavbar =
        document.querySelector(
            ".admin-navbar .nav-links"
        );


    if (!adminNavbar) return;


    if (
        document.getElementById(
            "admin-logout-link"
        )
    ) {
        return;
    }


    const logoutItem =
        document.createElement(
            "li"
        );


    logoutItem.innerHTML = `

        <a
            href="#"
            id="admin-logout-link"
            onclick="adminLogout(); return false;"
        >
            🚪 Admin Logout
        </a>

    `;


    adminNavbar.appendChild(
        logoutItem
    );

}


// =====================================================
// MENU PAGE
// =====================================================

function displayMenu(
    items = foodItems
) {

    const container =
        document.getElementById(
            "menu-food-container"
        );


    if (!container) return;


    container.innerHTML = "";


    if (items.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    No food items found 😔
                </h2>

                <p>
                    Please try another category.
                </p>

            </div>

        `;

        return;
    }


    items.forEach(food => {

        container.innerHTML += `

            <div class="food-card">

                <img
                    src="${food.image}"
                    alt="${food.name}"
                >


                <div class="food-info">

                    <h3>
                        ${food.name}
                    </h3>


                    <p>
                        ${food.description}
                    </p>


                    <span class="food-tag">
                        ${food.veg
                            ? "🟢 Veg"
                            : "🔴 Non-Veg"}
                    </span>


                    <strong>
                        ₹${food.price}
                    </strong>


                    <div class="food-actions">

                        <button
                            onclick="viewProduct(${food.id})"
                        >
                            View Details
                        </button>


                        <button
                            onclick="addToCart(${food.id})"
                        >
                            Add to Cart 🛒
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


// =====================================================
// MENU FILTER
// =====================================================

function filterMenu(category) {

    let filteredItems;


    if (category === "All") {

        filteredItems =
            foodItems;

    }

    else if (category === "Veg") {

        filteredItems =
            foodItems.filter(
                food => food.veg === true
            );

    }

    else if (category === "Non-Veg") {

        filteredItems =
            foodItems.filter(
                food => food.veg === false
            );

    }

    else if (category === "Burgers") {

        filteredItems =
            foodItems.filter(
                food =>
                    food.category === "Burger"
            );

    }

    else {

        filteredItems =
            foodItems.filter(
                food =>
                    food.category === category
            );

    }


    displayMenu(
        filteredItems
    );

}


// =====================================================
// PRODUCT DETAILS
// =====================================================

function viewProduct(id) {

    const product =
        foodItems.find(
            food =>
                food.id === id
        );


    if (!product) return;


    localStorage.setItem(
        "selectedFood",
        JSON.stringify(product)
    );


    window.location.href =
        "product.html";

}


// =====================================================
// DISPLAY PRODUCT PAGE
// =====================================================

function displayProduct() {

    const container =
        document.getElementById(
            "product-container"
        );


    if (!container) return;


    const product =
        JSON.parse(
            localStorage.getItem(
                "selectedFood"
            )
        );


    if (!product) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Product not found 😔
                </h2>


                <a
                    href="menu.html"
                    class="btn"
                >
                    Back to Menu
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML = `

        <div class="product-detail">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="product-info">

                <span class="food-tag">
                    ${product.veg
                        ? "🟢 Veg"
                        : "🔴 Non-Veg"}
                </span>


                <h1>
                    ${product.name}
                </h1>


                <p class="product-description">
                    ${product.description}
                </p>


                <h2>
                    ₹${product.price}
                </h2>


                <h3>
                    Ingredients
                </h3>


                <p>
                    Fresh ingredients, carefully selected
                    spices and quality products.
                </p>


                <h3>
                    Nutritional Information
                </h3>


                <p>
                    Calories: Approximately 300–500 kcal
                </p>


                <button
                    class="place-order-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart 🛒
                </button>


                <a
                    href="menu.html"
                    class="btn secondary-btn"
                >
                    ← Back to Menu
                </a>

            </div>

        </div>

    `;

}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // HOME

        if (
            document.getElementById(
                "food-container"
            )
        ) {

            displayFood(
                foodItems
            );

        }


        // MENU

        if (
            document.getElementById(
                "menu-food-container"
            )
        ) {

            displayMenu(
                foodItems
            );

        }


        // PRODUCT

        if (
            document.getElementById(
                "product-container"
            )
        ) {

            displayProduct();

        }


        // CART

        if (
            document.getElementById(
                "cart-items"
            )
        ) {

            displayCart();

        }


        // CHECKOUT

        if (
            document.getElementById(
                "checkout-items"
            )
        ) {

            displayCheckout();

        }


        // ORDERS

        if (
            document.getElementById(
                "orders-container"
            )
        ) {

            displayOrders();

        }


        // CART COUNT

        updateCartCount();


        // USER DISPLAY

        updateUserDisplay();


        // USER LOGOUT

        const logoutLink =
            document.getElementById(
                "logout-link"
            );


        if (logoutLink) {

            logoutLink.addEventListener(
                "click",
                logoutUser
            );

        }


        // ADMIN DASHBOARD

        const adminContainer =
            document.getElementById(
                "admin-orders-container"
            );


        if (adminContainer) {

            const loggedIn =
                localStorage.getItem(
                    "freshBiteAdminLoggedIn"
                );


            if (
                loggedIn !== "true"
            ) {

                window.location.href =
                    "admin-login.html";

                return;

            }


            addAdminLogoutButton();

            displayAdminOrders();

        }

    }
);