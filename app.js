

//Expense form element
const expenseForm = document.getElementById('expenseForm');
console.log('expenseform ',expenseForm);

// Input for expense title
const titleInput = document.getElementById('titleInput');
console.log('titleInput',titleInput)

// Input for expense amount
const amountInput = document.getElementById('amountInput');
console.log('amountInput ',amountInput);

// Select input for expense category
const categoryInput = document.getElementById('categoryInput');
console.log('categoryInput',categoryInput)

// ===== FILTER ELEMENT =====

// Select input used to filter expenses by category
const filterCategory = document.getElementById('filterCategory');
console.log('filterCategory',filterCategory)

// ===== DISPLAY ELEMENTS =====

// Unordered list where expenses will be rendered
const expenseList = document.getElementById('expenseList');
console.log('expense list',expenseList)

// Span element that displays the total amount spent
const totalAmountEl = document.getElementById('totalAmount');
console.log('totalAmountEl ',totalAmountEl)

// ===== APPLICATION STATE =====

// Array that stores all expense objects (single source of truth)
let expensesArray = [];

function initApp() {
    // Read saved expenses from localStorage and convert them back to an array
    // If nothing is saved yet, fall back to an empty array
    expensesArray = JSON.parse(localStorage.getItem('expense')) || [];

    // Render the UI using the loaded expenses
    render(expensesArray);
}

function addExpense() {
    let amountVal = amountInput.value;
    
    // Stop function execution if title is empty after removing spaces
    if(titleInput.value.trim() === '') {
        alert('Please input title of expenses')
        return   // stop if invalid
    }
    // Ensures the amount value is provided and greater than 0
    if(amountInput.value === '' || parseFloat(amountInput.value) < 0) {
        alert('Number must be greater than 1')
         return    // stop if invalid
    }
    // Ensures category is selected before proceeding
    if(categoryInput.value === '') {
        alert('Please select a category')
        return;
    }

    // A new expense object with a unique id
    // Date.now() is used to uniquely identify each expense
    const expense = {
        id: Date.now(),
        title: titleInput.value.trim(),
        amount:parseFloat(amountInput.value),
        category: categoryInput.value
    }

    expensesArray.push(expense);
    localStorage.setItem('expense',JSON.stringify(expensesArray))
    render(expensesArray);    

    titleInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';    
        

    totalAmountEl.innerHTML = sum;
}

function render(expenseToRender) {
    // Clear existing list to prevent duplicate rendering
    expenseList.innerHTML = '';

    // Loop through the array passed in and render each expense
    expenseToRender.forEach(exp => {
        const li = document.createElement('li');
        li.textContent = `${exp.title} | ₦${exp.amount} | ${exp.category} `;


        const deleteBtn = document.createElement('button');
        deleteBtn.className = `delete-btn`;
        deleteBtn.innerHTML = `&times;`;

        deleteBtn.addEventListener('click',() => {
            expensesArray = expensesArray.filter(e => e.id !== exp.id);
            localStorage.setItem('expense',JSON.stringify(expensesArray));
            render(expensesArray)
        })
        li.appendChild(deleteBtn);
        expenseList.appendChild(li);
    });

    // Calculate total amount from the currently rendered expenses
    // acc = running total, exp.amount = current expense amount
    const total = expenseToRender.reduce((acc,exp) => acc + exp.amount,0)
    totalAmountEl.innerHTML = total;
    
}

filterCategory.addEventListener('change',() => {
    const selectedCategory = filterCategory.value;
    
    if(selectedCategory === 'All') {
        render(expensesArray);        
    } else {
        const filtered = expensesArray.filter(exp => exp.category === selectedCategory)
        render(filtered);        
    }
})

expenseForm.addEventListener('submit',(e) => {
    e.preventDefault(); // prevent page reload on form submit
    addExpense(); 
})

initApp();

