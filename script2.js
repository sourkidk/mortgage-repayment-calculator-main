// Get all DOM elements
const form = document.querySelector('form');
const calculateBtn = document.querySelector('.calculate-button');
const clearAllBtn = document.querySelector('.top-row a');

// Input fields - using IDs
const mortgageAmountInput = document.getElementById('mortgage-amount');
const mortgageTermInput = document.getElementById('mortgage-term');
const interestRateInput = document.getElementById('interest-rate');
const repaymentRadio = document.getElementById('repayment');
const interestOnlyRadio = document.getElementById('interest-only');

// Output elements
const resultsEmpty = document.querySelector('.results-empty');
const resultsComplete = document.querySelector('.results-complete');
const monthlyPaymentOutput = document.querySelector('.monthly-payment');
const totalPaymentOutput = document.querySelector('.loan-value');

// Format mortgage amount with commas as user types
mortgageAmountInput.addEventListener('input', function(e) {
    // Remove all non-digits
    let value = this.value.replace(/\D/g, '');

    if (value) {
        // Format with commas (no decimals for mortgage amounts)
        this.value = parseInt(value).toLocaleString('en-GB');
    }

    clearFieldError(this);
});

// Validation function for individual fields
function validateField(input) {
    const wrapper = input.closest('.input-wrapper');
    const inputContainer = wrapper.querySelector('.input-with-symbol');
    const errorMessage = wrapper.querySelector('.error-message');

    // Remove commas for validation
    const value = input.value.replace(/,/g, '').trim();

    if (!value || value === '' || isNaN(value) || parseFloat(value) <= 0) {
        inputContainer.setAttribute('data-error', 'true');
        if (errorMessage) {
            errorMessage.style.display = 'block';
        }
        return false;
    } else {
        inputContainer.setAttribute('data-error', 'false');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        return true;
    }
}

// Validate mortgage type (radio buttons)
function validateMortgageType() {
    const mortgageTypeContainer = document.querySelector('.mortgage-type-selector');
    const errorMessage = mortgageTypeContainer.querySelector('.error-message');
    const radioButtons = mortgageTypeContainer.querySelectorAll('.radio-border');
    const isChecked = repaymentRadio.checked || interestOnlyRadio.checked;

    if (!isChecked) {
        radioButtons.forEach(border => {
            border.setAttribute('data-error', 'true');
            border.style.borderColor = 'var(--red)';
        });
        if (errorMessage) {
            errorMessage.style.display = 'block';
        }
        return false;
    } else {
        radioButtons.forEach(border => {
            border.setAttribute('data-error', 'false');
            border.style.borderColor = '';
        });
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;

    // Validate each field
    if (!validateField(mortgageAmountInput)) isValid = false;
    if (!validateField(mortgageTermInput)) isValid = false;
    if (!validateField(interestRateInput)) isValid = false;
    if (!validateMortgageType()) isValid = false;

    return isValid;
}

// Calculate mortgage payments
function calculateMortgage() {
    // Remove commas before parsing
    const principal = parseFloat(mortgageAmountInput.value.replace(/,/g, ''));
    const years = parseFloat(mortgageTermInput.value);
    const annualRate = parseFloat(interestRateInput.value);
    const isRepayment = repaymentRadio.checked;

    // Convert annual rate to monthly and decimal
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;

    let monthlyPayment;
    let totalPayment;

    if (isRepayment) {
        // Repayment mortgage calculation (principal + interest)
        if (monthlyRate === 0) {
            monthlyPayment = principal / numberOfPayments;
        } else {
            monthlyPayment = principal *
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }
        totalPayment = monthlyPayment * numberOfPayments;
    } else {
        // Interest-only mortgage calculation
        monthlyPayment = principal * monthlyRate;
        totalPayment = (monthlyPayment * numberOfPayments) + principal;
    }

    return {
        monthly: monthlyPayment,
        total: totalPayment
    };
}

// Format currency
function formatCurrency(amount) {
    return '£' + amount.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Display results
function displayResults(monthly, total) {
    monthlyPaymentOutput.textContent = formatCurrency(monthly);
    totalPaymentOutput.textContent = formatCurrency(total);

    // Hide empty state, show results
    resultsEmpty.classList.add('hidden');
    resultsComplete.classList.remove('hidden');
}

// Clear all form fields and reset
function clearForm() {
    // Clear input values
    mortgageAmountInput.value = '';
    mortgageTermInput.value = '';
    interestRateInput.value = '';
    repaymentRadio.checked = false;
    interestOnlyRadio.checked = false;

    // Clear all error states
    document.querySelectorAll('.input-with-symbol').forEach(container => {
        container.setAttribute('data-error', 'false');
    });

    document.querySelectorAll('.radio-border').forEach(border => {
        border.setAttribute('data-error', 'false');
        border.style.borderColor = '';
    });

    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
    });

    // Show empty state, hide results
    resultsEmpty.classList.remove('hidden');
    resultsComplete.classList.add('hidden');
}

// Clear errors on input - using event delegation
function clearFieldError(input) {
    const wrapper = input.closest('.input-wrapper');
    const container = wrapper.querySelector('.input-with-symbol');
    const errorMessage = wrapper.querySelector('.error-message');

    container.setAttribute('data-error', 'false');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

// Clear errors when typing in term and rate inputs
mortgageTermInput.addEventListener('input', function() {
    clearFieldError(this);
});

interestRateInput.addEventListener('input', function() {
    clearFieldError(this);
});

// Clear radio button errors on selection
repaymentRadio.addEventListener('change', validateMortgageType);
interestOnlyRadio.addEventListener('change', validateMortgageType);

// Calculate button click handler
calculateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (validateForm()) {
        const results = calculateMortgage();
        displayResults(results.monthly, results.total);
    } else {
        console.log('Form has errors - cannot calculate');
    }
});

// Clear all button click handler
clearAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearForm();
});

// Prevent form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

function formatCurrency(amount) {
    return '£' + amount.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function displayResults(monthly, total) {
    console.log('Displaying results....');

    monthlyPaymentOutput.textContent = formatCurrency(monthly);
    totalPaymentOutput.textContent = formatCurrency(total);

    resultsEmpty.classList.add('hidden');
    resultsComplete.classList.remove('hidden');
}