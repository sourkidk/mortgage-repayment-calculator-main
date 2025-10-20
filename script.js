const form = document.querySelector('.form-section form');
const calculateBtn = document.querySelector('.calculate-button');
const clearAllBtn = document.querySelector('.clear-all-btn');

const mortgageAmountInput = document.getElementById('mortgage-amount');
const mortgageTermInput = document.getElementById('mortgage-term');
const interestRateInput = document.getElementById('interest-rate');

const repaymentRadio = document.getElementById('repayment');
const interestOnlyRadio = document.getElementById('interest-only');

const resultsEmpty = document.querySelector('.results-empty');
const resultsComplete = document.querySelector('.results-complete');

const monthlyPaymentOutput = document.querySelector('.monthly-payment');
const totalPaymentOutput = document.querySelector('.loan-value');

// console.log('Form', form);
// console.log('Calculate button:', calculateBtn);
// console.log('Mortgage amount input:', mortgageAmountInput);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    // console.log('Form Submission Prevented');
});

calculateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Calculate button clicked!');


    if (validateForm()) {
        console.log('Form is valid - ready to calculate');

        const results = calculateMortgage();

        displayResults(results.monthly, results.total);

    } else {
        console.log('Form has errors - cannot calculate');
    }
});

clearAllBtn.addEventListener('click', function(e) {
    e.preventDefault();
    clearForm();
    // console.log('Clear all button clicked');
});

mortgageAmountInput.addEventListener('input', function(e) {
    let value = this.value;
    // console.log('Original value', value);

    value = value.replace(/\D/g, '');

    // console.log('After removing non-digits;', value);

    if (value) {
        const formatted = parseInt(value).toLocaleString('en-GB');
        // console.log('Formatted value;', formatted);
        this.value = formatted;
    } else {
        this.value = '';
    }

    clearFieldError(this);

});



function validateField(input) {
    console.log('Validate field', input.id);

    const wrapper = input.closest('.input-wrapper');
    const inputContainer = wrapper.querySelector('.input-with-symbol');
    const errorMessage = wrapper.querySelector('.error-message');
    // console.log('Input container found', inputContainer);
    // console.log(inputContainer);
    // console.dir(inputContainer);
    // console.log(inputContainer.dataset);
    // console.log('Error message found', errorMessage);

    const value = input.value.replace(/,/g, '').trim();

    // console.log('Input value (cleaned):', value);

    const isEmpty = !value || value === '';
    const isNotANumber = isNaN(value);
    const isZeroOrNegative = parseFloat(value) <= 0;

    // console.log('Is empty?', isEmpty);
    // console.log('Is not a number?', isNotANumber);
    // console.log('Is zero or negative', isZeroOrNegative);

    if ( isEmpty || isNotANumber || isZeroOrNegative ) {
        // console.log('X VALIDATION FAILED');

        inputContainer.setAttribute('data-error', true);

        if (errorMessage) {
            errorMessage.style.display = 'block';
        }

        return false;
    } else {
        // console.log('Validation PASSED');

        inputContainer.setAttribute('data-error', 'false');

        if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        return true;
    }
}

function validateMortgageType() {
    // console.log('Validate mortgage type...');

    const mortgageTypeContainer = document.querySelector('.mortgage-type-selector');
    const errorMessage = mortgageTypeContainer.querySelector('.error-message');
    const radioButtons = mortgageTypeContainer.querySelectorAll('.radio-border');

    // console.log('Radio container:', mortgageTypeContainer);
    // console.log('Type', typeof radioButtons);
    // console.log('Radio borders found', radioButtons.length);

    const isChecked = repaymentRadio.checked || interestOnlyRadio.checked;

    // console.log('Repayment checked?', repaymentRadio.checked);
    // console.log('Interest Only Checked', interestOnlyRadio.checked);
    // console.log('At least one checked', isChecked);

    if (!isChecked) {
        // console.log('X NO RADIO SELECTED');

        radioButtons.forEach(border => {
            border.setAttribute('data-error', 'true');
            border.style.borderColor = 'var(--red)';
        });

        if (errorMessage) {
            errorMessage.style.display = 'block';
        }

        return false;
    } else {
        // console.log('RADIO SELECTED');

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

function validateForm() {
    console.log('Validating entire form...');

    let isValid = true;

    if (!validateField(mortgageAmountInput)) {
        isValid = false;
    }

    if (!validateField(mortgageTermInput)) {
        isValid = false;
    }

    if (!validateField(interestRateInput)) {
        isValid = false;
    }

    if (!validateMortgageType()) {
        isValid = false;
    }

    console.log('Form Valid?', isValid);

    return isValid;
}

function clearFieldError(input) {
    const wrapper = input.closest('.input-wrapper');
    const container = wrapper.querySelector('.input-with-symbol');
    const errorMessage = wrapper.querySelector('.error-message');

    container.setAttribute('data-error', 'false');

    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

    // console.log('Wrapper found', wrapper);
mortgageTermInput.addEventListener('input', function() {
    clearFieldError(this);
});

interestRateInput.addEventListener('input', function() {
    clearFieldError(this);
});

repaymentRadio.addEventListener('change', validateMortgageType);
interestOnlyRadio.addEventListener('change', validateMortgageType);

function calculateMortgage() {
    console.log('Starting calculation...');

    const principal = parseFloat(mortgageAmountInput.value.replace(/,/g, ''));
    const years = parseFloat(mortgageTermInput.value);
    const annualRate = parseFloat(interestRateInput.value);
    const isRepayment = repayment.checked;

    const monthlyRate = (annualRate / 100 / 12);
    const numberOfPayments = years * 12;

    let monthlyPayment;
    let totalPayment;

    if (isRepayment) {

        if (monthlyRate === 0) {
            monthlyPayment = principal / numberOfPayments;
        } else {
            monthlyPayment = principal *
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }

        totalPayment = monthlyPayment * numberOfPayments;

    } else {
        monthlyPayment = principal * monthlyRate;
        totalPayment = (monthlyPayment * numberOfPayments) + principal;
    }

    return {
        monthly: monthlyPayment,
        total: totalPayment
    };
}

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


function clearForm() {
    mortgageAmountInput.value = '';
    mortgageTermInput.value = '';
    interestRateInput.value = '';

    repaymentRadio.checked = false;
    interestOnlyRadio.checked = false;

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

    resultsEmpty.classList.remove('hidden');
    resultsComplete.classList.add('hidden');





}









