// Κατάσταση εφαρμογής
const state = {
    cart: [],
    total: 0,
    customerName: "",
	paymentMethod: "cash"
};

// Δεδομένα μενού
const menuItems = {
    "Καφέδες/Ροφήματα": [
        { 
            name: "Φραπές", 
            price: 2.50, 
            options: {
                "Ζάχαρη": ["Σκέτος", "Ολίγη", "1 Ζάχαρη", "Μέτριος", "Γλυκός", "Πολύ Γλυκός"],
                "Ειδική προτίμηση": ["Μαύρη Ζάχαρη", "Ζαχαρίνη", "Στέβια"],
                "Extras": ["Decafeine", "Γάλα"],
                "Νερό": ["Ναι (+0.50€)"]
            }
        },
        { 
            name: "Καφές Ελληνικός", 
            price: 1.50, 
            options: {
                "Ζάχαρη": ["Σκέτος", "Ολίγη", "1 Ζάχαρη", "Μέτριος", "Γλυκός", "Πολύ Γλυκός"],
                "Ειδική προτίμηση": ["Μαύρη Ζάχαρη", "Ζαχαρίνη", "Στέβια"],
                "Extras": ["Decafeine"],
                "Νερό": ["Ναι (+0.50€)"]
            }
        },
		{ 
            name: "Φρέντο Εσπρέσο", 
            price: 2.50, 
            options: {
                "Ζάχαρη": ["Σκέτος", "Ολίγη", "1 Ζάχαρη", "Μέτριος", "Γλυκός", "Πολύ Γλυκός"],
                "Ειδική προτίμηση": ["Μαύρη Ζάχαρη", "Ζαχαρίνη", "Στέβια"],
                "Extras": ["Decafeine"],
                "Νερό": ["Ναι (+0.50€)"]
            }
        },
		
		
		
    ],
    "Αναψυκτικά": [
        { name: "Coca Cola", price: 2.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] },
        { name: "Coca Cola Zero", price: 2.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] },
        { name: "Coca Cola Λεμόνι Zero", price: 2.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] },
    ],
    "Χυμοί": [
        { name: "Orange Juice", price: 3.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] },
        { name: "Apple Juice", price: 3.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] }
    ],
    "Κρύο Τσάι": [
        { name: "Peach Iced Tea", price: 3.50, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] },
        { name: "Green Iced Tea", price: 3.50, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] }
    ],
    "Μπύρες": [
        { name: "Lager", price: 4.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] },
        { name: "IPA", price: 5.00, options: ["Ποτήρι", "Παγάκια", "Ζεστό"] }
    ],
    "Σάντουιτς/Πίτσα": [
        { name: "Ham & Cheese Sandwich", price: 5.00, options: ["Toasted", "Extra cheese", "No mayo", "Gluten-free", "Add bacon", "Add avocado"] },
        { name: "Margherita Pizza", price: 10.00, options: ["Extra cheese", "Gluten-free", "Add mushrooms", "Add olives", "Add pepperoni", "Add onions"] }
    ],
    "Παγωτό": [
        { name: "Vanilla", price: 3.00 },
        { name: "Chocolate", price: 3.00 }
    ]
};

let currentProduct = null;

// Αρχικοποίηση event listeners
document.addEventListener('DOMContentLoaded', () => {
	const currentWaiter = localStorage.getItem('currentWaiter');
    if (!currentWaiter) {
        window.location.href = 'index.html';
    } else {
        const waiterNameElement = document.getElementById('waiterName');
        waiterNameElement.textContent = `Σερβιτόρος: ${currentWaiter}`;
    }
    document.getElementById('customerInfo').addEventListener('submit', startOrder);
    document.getElementById('backButton').addEventListener('click', backToCategories);
    document.getElementById('placeOrderButton').addEventListener('click', placeOrder);
    document.getElementById('clearOrderButton').addEventListener('click', clearOrder);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('modalAddToCart').addEventListener('click', addToCartFromModal);
// Event delegation για τα κουμπιά ποσότητας
    document.getElementById('productModal').addEventListener('click', handleQuantityChange);
    
    // Event listener για τον έλεγχο της εισαγωγής στο πεδίο ποσότητας
    document.getElementById('modalQuantity').addEventListener('input', validateQuantityInput);
	document.getElementById('searchButton').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });
});

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const itemsList = document.getElementById('itemsList');
    const items = itemsList.getElementsByTagName('li');
    let found = false;

    for (let i = 0; i < items.length; i++) {
        const itemName = items[i].querySelector('.item-name').textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            items[i].style.display = '';
            highlightSearchTerm(items[i], searchTerm);
            found = true;
        } else {
            items[i].style.display = 'none';
        }
    }

    if (!found) {
        alert('Δεν βρέθηκαν προϊόντα που να ταιριάζουν με την αναζήτησή σας.');
    }
}

function highlightSearchTerm(element, searchTerm) {
    const itemName = element.querySelector('.item-name');
    const innerHTML = itemName.innerHTML;
    const index = innerHTML.toLowerCase().indexOf(searchTerm);
    if (index >= 0) {
        const highlightedHTML = innerHTML.substring(0, index) + 
                                "<span class='highlight'>" + 
                                innerHTML.substring(index, index + searchTerm.length) + 
                                "</span>" + 
                                innerHTML.substring(index + searchTerm.length);
        itemName.innerHTML = highlightedHTML;
    }
}

// Αυξομιωση ποσοτητας
function handleQuantityChange(event) {
    if (event.target.classList.contains('quantity-btn')) {
        const quantityInput = document.getElementById('modalQuantity');
        let currentValue = parseInt(quantityInput.value) || 0;

        if (event.target.classList.contains('minus') && currentValue > 1) {
            quantityInput.value = currentValue - 1;
        } else if (event.target.classList.contains('plus')) {
            quantityInput.value = currentValue + 1;
        }
    }
}

function validateQuantityInput(event) {
    const input = event.target;
    const value = input.value;
    
    // Αφαιρούμε οποιονδήποτε μη αριθμητικό χαρακτήρα
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    
    // Εάν η τιμή είναι κενή ή 0, θέτουμε την τιμή σε 1
    if (sanitizedValue === '' || parseInt(sanitizedValue) === 0) {
        input.value = '1';
    } else {
        input.value = sanitizedValue;
    }
}



// Έναρξη παραγγελίας
function startOrder(event) {
    event.preventDefault();
    state.customerName = document.getElementById('customerName').value.trim();
    if (state.customerName === "") {
        alert("Παρακαλώ εισάγετε όνομα πελάτη ή αριθμό τραπεζιού.");
        return;
    }
    document.getElementById('customerInfo').style.display = 'none';
    document.getElementById('menuCategories').style.display = 'block';
    document.getElementById('orderCustomer').textContent = state.customerName;
    
    updateOrderVisibility();
    
    // Εμφάνιση κατηγοριών μενού
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    Object.keys(menuItems).forEach(category => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => showCategory(category));
        li.appendChild(button);
        categoryList.appendChild(li);
    });
}

// Εμφάνιση προϊόντων συγκεκριμένης κατηγορίας
function showCategory(category) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    menuItems[category].forEach(item => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <button class="add-to-cart-btn" aria-label="Προσθήκη ${item.name} στο καλάθι">+</button>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">€${item.price.toFixed(2)}</div>
            </div>
        `;
        li.querySelector('.add-to-cart-btn').addEventListener('click', () => openProductModal(item, category));
        itemsList.appendChild(li);
    });
    document.getElementById('categoryTitle').textContent = category;
    document.getElementById('menuCategories').style.display = 'none';
    document.getElementById('menuItems').style.display = 'block';

// Επαναφορά της εμφάνισης όλων των προϊόντων
    const items = itemsList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = '';
        items[i].querySelector('.item-name').innerHTML = items[i].querySelector('.item-name').textContent;
    }
    
    // Καθαρισμός του πεδίου αναζήτησης
    document.getElementById('searchInput').value = '';
}

// Άνοιγμα modal για προσθήκη προϊόντος στο καλάθι
function openProductModal(product, category) {
    // Αποθήκευση του τρέχοντος προϊόντος για μελλοντική χρήση
	currentProduct = { ...product, category };
    const modal = document.getElementById('productModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalOptions = document.getElementById('modalOptions');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalComment = document.getElementById('modalComment');

    // Ενημέρωση του ονόματος και της τιμής του προϊόντος στο modal
    modalProductName.textContent = `${product.name} - €${product.price.toFixed(2)}`;
    
    // Καθαρισμός προηγούμενων επιλογών
    modalOptions.innerHTML = '';
    
    // Επαναφορά της ποσότητας και του σχολίου
    modalQuantity.value = '1';
    modalComment.value = '';

	// Έλεγχος αν το προϊόν έχει επιλογές
    if (product.options) {
        if (Array.isArray(product.options)) {
            // Χειρισμός απλών επιλογών (π.χ. για "Αναψυκτικά")
            const optionCategoryDiv = document.createElement('div');
            optionCategoryDiv.className = 'option-category';
            optionCategoryDiv.innerHTML = '<strong>Επιλογές:</strong>';
            
            const optionChoicesDiv = document.createElement('div');
            optionChoicesDiv.className = 'option-choices';
            
			// Δημιουργία checkbox για κάθε επιλογή
            product.options.forEach(choice => {
                const choiceDiv = document.createElement('div');
                choiceDiv.className = 'option-checkbox';
                choiceDiv.innerHTML = `
                    <input type="checkbox" id="${product.name}-${choice}" name="${product.name}-options" value="${choice}">
                    <label for="${product.name}-${choice}">${choice}</label>
                `;
                optionChoicesDiv.appendChild(choiceDiv);
            });
            
            optionCategoryDiv.appendChild(optionChoicesDiv);
            modalOptions.appendChild(optionCategoryDiv);
        } else {
            // Χειρισμός σύνθετων επιλογών (π.χ. για "Καφέδες/Ροφήματα")
            for (const [optionCategory, optionChoices] of Object.entries(product.options)) {
                const optionCategoryDiv = document.createElement('div');
                optionCategoryDiv.className = 'option-category';
                optionCategoryDiv.innerHTML = `<strong>${optionCategory}:</strong>`;
                
                const optionChoicesDiv = document.createElement('div');
                optionChoicesDiv.className = 'option-choices';
                
				// Δημιουργία checkbox για κάθε επιλογή στην κατηγορία
                optionChoices.forEach(choice => {
                    const choiceDiv = document.createElement('div');
                    choiceDiv.className = 'option-checkbox';
                    choiceDiv.innerHTML = `
                        <input type="checkbox" id="${product.name}-${optionCategory}-${choice}" name="${product.name}-${optionCategory}" value="${choice}">
                        <label for="${product.name}-${optionCategory}-${choice}">${choice}</label>
                    `;
                    optionChoicesDiv.appendChild(choiceDiv);
                });
                
                optionCategoryDiv.appendChild(optionChoicesDiv);
                modalOptions.appendChild(optionCategoryDiv);
            }
        }
    }
	
	// Εμφάνιση του modal
    modal.style.display = 'block';
}


// Κλείσιμο modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Προσθήκη προϊόντος στο καλάθι από το modal
function addToCartFromModal() {
    if (!currentProduct) return;
	
	// Λήψη ποσότητας και σχολίου από το modal
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    const comment = document.getElementById('modalComment').value.trim();
	
	// Έλεγχος εγκυρότητας ποσότητας
    if (quantity < 1) {
        alert("Παρακαλώ εισάγετε έγκυρη ποσότητα.");
        return;
    }

    let basePrice = currentProduct.price;
    let totalPrice = basePrice * quantity;
    
    let selectedOptions = {};
	
	// Συλλογή επιλεγμένων επιλογών
    if (currentProduct.options) {
        if (Array.isArray(currentProduct.options)) {
            // Για κατηγορίες όπως "Αναψυκτικά"
            const optionInputs = document.getElementsByName(`${currentProduct.name}-options`);
            selectedOptions['Επιλογές'] = Array.from(optionInputs)
                .filter(input => input.checked)
                .map(input => input.value);
        } else {
            // Για κατηγορίες όπως "Καφέδες/Ροφήματα"
            for (const [optionCategory, optionChoices] of Object.entries(currentProduct.options)) {
                const optionInputs = document.getElementsByName(`${currentProduct.name}-${optionCategory}`);
                selectedOptions[optionCategory] = Array.from(optionInputs)
                    .filter(input => input.checked)
                    .map(input => input.value);
                
				// Ειδικός χειρισμός για την επιλογή "Νερό"
                if (optionCategory === "Νερό" && selectedOptions[optionCategory].includes("Ναι (+0.50€)")) {
                    totalPrice += 0.50 * quantity;
                }
            }
        }
    }

	// Προσθήκη του προϊόντος στο καλάθι
    state.cart.push({ 
        name: currentProduct.name, 
        price: basePrice,
        quantity, 
        comment, 
        totalPrice, 
        selectedOptions 
    });
    state.total += totalPrice;
	
	// Ενημέρωση του UI
    updateCart();

    alert('Το προϊόν προστέθηκε στο καλάθι!');
    closeModal();
}



// Επιστροφή στις κατηγορίες
function backToCategories() {
    document.getElementById('menuItems').style.display = 'none';
    document.getElementById('menuCategories').style.display = 'block';
}

// Ενημέρωση του καλαθιού στο UI
function updateCart() {
    const orderList = document.getElementById('orderList');
    const totalElement = document.getElementById('total');
    
	// Καθαρισμός της προηγούμενης λίστας
    orderList.innerHTML = '';
	// Δημιουργία νέων στοιχείων λίστας για κάθε προϊόν στο καλάθι
    state.cart.forEach((item, index) => {
        const li = document.createElement('li');
        let optionsHtml = '';
		
		 // Δημιουργία HTML για τις επιλογές του προϊόντος
        for (const [category, options] of Object.entries(item.selectedOptions)) {
            if (options.length > 0) {
                optionsHtml += `<br>${category}: ${options.join(', ')}`;
            }
        }
		
		// Δημιουργία του HTML για το στοιχείο του καλαθιού
        li.innerHTML = `
            <div class="cart-item">
                <button class="remove-item" aria-label="Αφαίρεση ${item.name} από το καλάθι">✖</button>
                <div class="cart-item-details">
                    <strong>${item.name}</strong> - €${item.totalPrice.toFixed(2)}
                    <br>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" aria-label="Μείωση ποσότητας">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" aria-label="Αύξηση ποσότητας">+</button>
                    </div>
                    ${optionsHtml}
                    ${item.comment ? `<br>Σημείωση: ${item.comment}` : ''}
                </div>
            </div>
        `;
		
		// Προσθήκη event listeners για τα κουμπιά του καλαθιού
        li.querySelector('.remove-item').addEventListener('click', () => removeFromCart(index));
        li.querySelector('.quantity-btn.minus').addEventListener('click', () => updateCartItemQuantity(index, -1));
        li.querySelector('.quantity-btn.plus').addEventListener('click', () => updateCartItemQuantity(index, 1));
        orderList.appendChild(li);
    });
    
	// Ενημέρωση του συνολικού ποσού
    totalElement.textContent = state.total.toFixed(2);
	
	// Ενημέρωση της ορατότητας του τμήματος παραγγελίας
    updateOrderVisibility();
}


function editCartItem(index) {
    const item = state.cart[index];
    currentProduct = { ...item, category: item.category };
    
    const modal = document.getElementById('productModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalOptions = document.getElementById('modalOptions');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalComment = document.getElementById('modalComment');

    modalProductName.textContent = `${item.name} - €${item.price.toFixed(2)}`;
    modalOptions.innerHTML = '';
    modalQuantity.value = item.quantity;
    modalComment.value = item.comment || '';

    // Επαναδημιουργία των επιλογών
    if (item.selectedOptions) {
        for (const [optionCategory, optionChoices] of Object.entries(item.selectedOptions)) {
            const optionCategoryDiv = document.createElement('div');
            optionCategoryDiv.className = 'option-category';
            optionCategoryDiv.innerHTML = `<strong>${optionCategory}:</strong>`;
            
            const optionChoicesDiv = document.createElement('div');
            optionChoicesDiv.className = 'option-choices';
            
            menuItems[item.category].find(p => p.name === item.name).options[optionCategory].forEach(choice => {
                const choiceDiv = document.createElement('div');
                choiceDiv.className = 'option-checkbox';
                choiceDiv.innerHTML = `
                    <input type="checkbox" id="${item.name}-${optionCategory}-${choice}" 
                           name="${item.name}-${optionCategory}" value="${choice}"
                           ${optionChoices.includes(choice) ? 'checked' : ''}>
                    <label for="${item.name}-${optionCategory}-${choice}">${choice}</label>
                `;
                optionChoicesDiv.appendChild(choiceDiv);
            });
            
            optionCategoryDiv.appendChild(optionChoicesDiv);
            modalOptions.appendChild(optionCategoryDiv);
        }
    }

    // Αλλαγή του κουμπιού "Προσθήκη στο Καλάθι" σε "Ενημέρωση"
    const addToCartButton = document.getElementById('modalAddToCart');
    addToCartButton.textContent = 'Ενημέρωση';
    addToCartButton.onclick = () => updateCartItem(index);

    modal.style.display = 'block';
}



function updateCartItem(index) {
    if (!currentProduct) return;

    const quantity = parseInt(document.getElementById('modalQuantity').value);
    const comment = document.getElementById('modalComment').value.trim();

    if (quantity < 1) {
        alert("Παρακαλώ εισάγετε έγκυρη ποσότητα.");
        return;
    }

    let basePrice = currentProduct.price;
    let totalPrice = basePrice * quantity;
    
    let selectedOptions = {};
    if (currentProduct.selectedOptions) {
        for (const [optionCategory, _] of Object.entries(currentProduct.selectedOptions)) {
            const optionInputs = document.getElementsByName(`${currentProduct.name}-${optionCategory}`);
            selectedOptions[optionCategory] = Array.from(optionInputs)
                .filter(input => input.checked)
                .map(input => input.value);
            
            if (optionCategory === "Νερό" && selectedOptions[optionCategory].includes("Ναι (+0.50€)")) {
                totalPrice += 0.50 * quantity;
            }
        }
    }

    state.total -= state.cart[index].totalPrice;
    state.cart[index] = { 
        ...currentProduct,
        quantity, 
        comment, 
        totalPrice, 
        selectedOptions 
    };
    state.total += totalPrice;

    updateCart();
    alert('Το προϊόν ενημερώθηκε!');
    closeModal();

    // Επαναφορά του κουμπιού "Προσθήκη στο Καλάθι"
    const addToCartButton = document.getElementById('modalAddToCart');
    addToCartButton.textContent = 'Προσθήκη στο Καλάθι';
    addToCartButton.onclick = addToCartFromModal;
}


function updateCartItemQuantity(index, change) {
    const item = state.cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        // Αν η νέα ποσότητα είναι μικρότερη από 1, αφαιρούμε το προϊόν
        removeFromCart(index);
    } else {
        // Υπολογίζουμε τη νέα τιμή
        const basePrice = item.totalPrice / item.quantity;
        const newTotalPrice = basePrice * newQuantity;
        
        // Ενημερώνουμε το συνολικό ποσό
        state.total = state.total - item.totalPrice + newTotalPrice;
        
        // Ενημερώνουμε το προϊόν στο καλάθι
        state.cart[index] = {
            ...item,
            quantity: newQuantity,
            totalPrice: newTotalPrice
        };
    }
    
    // Ενημερώνουμε την εμφάνιση του καλαθιού
    updateCart();
}




// Αφαίρεση προϊόντος από το καλάθι
function removeFromCart(index) {
    if (confirm("Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτό το προϊόν;")) {
        const removedItem = state.cart.splice(index, 1)[0];
        state.total -= removedItem.totalPrice;
        updateCart();
    }
}

// Ενημέρωση ορατότητας της παραγγελίας
function updateOrderVisibility() {
    const orderSection = document.getElementById('order');
    if (state.cart.length > 0) {
        orderSection.style.display = 'block';
    } else {
        orderSection.style.display = 'none';
    }
}

// Ολοκλήρωση παραγγελίας
function placeOrder() {
    if (state.cart.length === 0) {
        alert('Παρακαλώ προσθέστε προϊόντα στο καλάθι σας πριν την ολοκλήρωση της παραγγελίας.');
        return;
    }
    
    state.orderComment = document.getElementById('orderComment').value.trim();
    state.paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Λήψη του ονόματος του σερβιτόρου από το localStorage
    const waiterName = localStorage.getItem('currentWaiter');

    // Δημιουργία αντικειμένου παραγγελίας
    const order = {
        id: Date.now(), // μοναδικό αναγνωριστικό
        waiter: waiterName, // Προσθήκη του ονόματος του σερβιτόρου
        customerName: state.customerName,
        items: state.cart,
        total: state.total,
        comment: state.orderComment,
        paymentMethod: state.paymentMethod,
        timestamp: new Date().toLocaleString()
    };

    // Αποθήκευση της παραγγελίας
    saveOrder(order);
}

    // Αποθήκευση της παραγγελίας στο localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
	
    alert(`Η παραγγελία του σερβιτόρου ${order.waiter} στάλθηκε στην κουζίνα!`);
    resetOrder();
}


// Ακύρωση παραγγελίας
function clearOrder() {
    if (confirm("Είστε σίγουροι ότι θέλετε να ακυρώσετε την παραγγελία;")) {
        resetOrder();
    }
}

// Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως σερβιτόρος
const currentWaiter = localStorage.getItem('currentWaiter');
if (!currentWaiter) {
    window.location.href = 'index.html';
}

// Εμφάνιση του ονόματος του σερβιτόρου
document.addEventListener('DOMContentLoaded', function() {
    const currentWaiter = localStorage.getItem('currentWaiter');
    if (!currentWaiter) {
        window.location.href = 'index.html';
    } else {
        const waiterNameElement = document.getElementById('waiterName');
        if (waiterNameElement) {
            waiterNameElement.textContent = currentWaiter;
        } else {
            console.error('Το στοιχείο με id "waiterName" δεν βρέθηκε.');
        }
    }

    // Προσθέστε event listener για το κουμπί αποσύνδεσης
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error('Το στοιχείο με id "logoutButton" δεν βρέθηκε.');
    }
});


// Συνάρτηση αποσύνδεσης
function logout() {
    localStorage.removeItem('currentWaiter');
    window.location.href = 'index.html';
}



// Επαναφορά της εφαρμογής στην αρχική κατάσταση
function resetOrder() {
    state.cart = [];
    state.total = 0;
    state.customerName = "";
    state.orderComment = ""; // Επαναφορά του γενικού σχολίου
	state.paymentMethod = "cash";
    document.querySelector('input[name="paymentMethod"][value="cash"]').checked = true;
    document.getElementById('customerName').value = '';
    document.getElementById('orderComment').value = ''; // Καθαρισμός του πεδίου σχολίου
    document.getElementById('customerInfo').style.display = 'block';
    document.getElementById('menuCategories').style.display = 'none';
    document.getElementById('menuItems').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    updateCart();
}