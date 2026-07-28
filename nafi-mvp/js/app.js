const getPricePerEmployee = (employees) => {
  if (employees <= 500) {
    return 390;
  }

  if (employees <= 4000) {
    return 370;
  }

  return 340;
};

const initBurgerMenu = () => {
  const header = document.querySelector('.header');
  const toggle = header?.querySelector('[data-menu-toggle]');
  const menu = header?.querySelector('#main-menu');

  if (!header || !toggle || !menu) {
    return;
  }

  const closeMenu = (restoreFocus = false) => {
    header.classList.remove('header--menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');

    if (restoreFocus) {
      toggle.focus();
    }
  };

  const openMenu = () => {
    header.classList.add('header--menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
  };

  toggle.addEventListener('click', () => {
    if (header.classList.contains('header--menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('click', (event) => {
    if (
      header.classList.contains('header--menu-open') &&
      !header.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      header.classList.contains('header--menu-open')
    ) {
      closeMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023) {
      closeMenu();
    }
  });
};

const initCalculator = () => {
  const calculator = document.querySelector('.calculator');

  if (!calculator) {
    return;
  }

  const range = calculator.querySelector(
    '.calculator-range__input'
  );

  const valueElement = calculator.querySelector(
    '.calculator-range__value'
  );

  const valueEmployees = calculator.querySelector(
    '.calculator-employees__input'
  );

  const resultEmployees = calculator.querySelector(
    '[data-employees]'
  );

  const resultPrice = calculator.querySelector(
    '.result__value[data-price]'
  );

  const resultOptions = calculator.querySelector(
    '[data-options]'
  );

  const resultTotal = calculator.querySelector(
    '[data-total]'
  );

  const currentPrice = calculator.querySelector(
    '[data-current-price]'
  );

  // Только платные опции калькулятора
  const optionCheckboxes = document.querySelectorAll(
    '.calculator .checkbox__input[data-price], .services-modal .checkbox__input[data-price]'
  );

  if (
    !range ||
    !valueElement ||
    !valueEmployees ||
    !resultEmployees ||
    !resultPrice ||
    !resultOptions ||
    !resultTotal
  ) {
    return;
  }

  const updateCalculator = () => {
    const employees = Number(valueEmployees.value) || 0;
    const price = getPricePerEmployee(employees);

    range.value = employees;
    valueEmployees.value = employees;

    valueElement.textContent =
      `${employees.toLocaleString('ru-RU')} сотрудников`;

    resultEmployees.textContent =
      `${employees.toLocaleString('ru-RU')} сотрудников`;

    resultPrice.textContent =
      `${price.toLocaleString('ru-RU')} ₽`;

    if (currentPrice) {
      currentPrice.textContent =
        `${price.toLocaleString('ru-RU')} ₽`;
    }

    const progress =
      ((employees - Number(range.min)) /
        (Number(range.max) - Number(range.min))) * 100;

    range.style.setProperty(
      '--range-progress',
      `${Math.max(0, Math.min(100, progress))}%`
    );

    let optionsPrice = 0;

    optionCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        optionsPrice += Number(checkbox.dataset.price) || 0;
      }
    });

    resultOptions.textContent =
      `+${optionsPrice.toLocaleString('ru-RU')} ₽`;

    const total = employees * price + optionsPrice;

    resultTotal.textContent =
      `${total.toLocaleString('ru-RU')} ₽`;

    calculator.dispatchEvent(
      new CustomEvent('calculator:updated')
    );
  };

  range.addEventListener('input', () => {
    valueEmployees.value = range.value;
    updateCalculator();
  });

  valueEmployees.addEventListener('input', () => {
    const min = Number(range.min);
    const max = Number(range.max);
    let value = Number(valueEmployees.value);

    if (Number.isNaN(value)) {
      return;
    }

    if (value < min) {
      value = min;
    }

    if (value > max) {
      value = max;
    }

    valueEmployees.value = value;
    updateCalculator();
  });

  optionCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateCalculator);
  });

  updateCalculator();
};

const initServicesModal = () => {
  const modal = document.querySelector('[data-services-modal]');
  const openButton = document.querySelector('[data-services-open]');

  if (!modal || !openButton) {
    return;
  }

  const closeButton = modal.querySelector('[data-services-close]');
  const applyButton = modal.querySelector('[data-services-apply]');
  const serviceInputs = modal.querySelectorAll(
    '.checkbox__input[data-price]'
  );
  const countOutput = modal.querySelector('[data-services-count]');
  const totalOutput = modal.querySelector('[data-services-total]');

  const updateSummary = () => {
    const selected = Array.from(serviceInputs).filter(
      (input) => input.checked
    );
    const total = selected.reduce(
      (sum, input) => sum + (Number(input.dataset.price) || 0),
      0
    );

    if (countOutput) {
      countOutput.textContent = selected.length.toLocaleString('ru-RU');
    }

    if (totalOutput) {
      totalOutput.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    }
  };

  const closeModal = () => {
    modal.close();
  };

  openButton.addEventListener('click', () => {
    updateSummary();
    modal.showModal();
    document.body.classList.add('scroll-lock');
  });

  closeButton?.addEventListener('click', closeModal);
  applyButton?.addEventListener('click', closeModal);

  serviceInputs.forEach((input) => {
    input.addEventListener('change', updateSummary);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener('close', () => {
    document.body.classList.remove('scroll-lock');
    openButton.focus();
  });

  updateSummary();
};

const initConsultationModal = () => {
  const modal = document.querySelector('[data-consultation-modal]');
  const openButtons = document.querySelectorAll('[data-consultation-open]');

  if (!modal || !openButtons.length) {
    return;
  }

  const form = modal.querySelector('[data-consultation-form]');
  const content = modal.querySelector('.consultation-form__content');
  const success = modal.querySelector('[data-consultation-success]');
  const closeButton = modal.querySelector('[data-consultation-close]');
  const doneButton = modal.querySelector('[data-consultation-done]');
  const agreement = modal.querySelector('#consultation-agreement');
  const submitButton = form?.querySelector('button[type="submit"]');
  let lastOpenButton = null;

  const updateSubmit = () => {
    if (submitButton) {
      submitButton.disabled = !agreement?.checked;
    }
  };

  const closeModal = () => {
    modal.close();
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      lastOpenButton = button;

      if (content) content.hidden = false;
      if (success) success.hidden = true;

      modal.showModal();
      document.body.classList.add('scroll-lock');
      modal.querySelector('input:not([type="checkbox"])')?.focus();
    });
  });

  agreement?.addEventListener('change', updateSubmit);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (content) content.hidden = true;
    if (success) success.hidden = false;
    success?.querySelector('h2')?.setAttribute('tabindex', '-1');
    success?.querySelector('h2')?.focus();
  });

  closeButton?.addEventListener('click', closeModal);
  doneButton?.addEventListener('click', () => {
    form?.reset();
    updateSubmit();
    closeModal();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener('close', () => {
    document.body.classList.remove('scroll-lock');
    lastOpenButton?.focus();
  });

  updateSubmit();
};

const initFormSwitcher = () => {
  const connection = document.querySelector('.connection');

  if (!connection) {
    return;
  }

  const buttons = connection.querySelectorAll(
    '.connection__switch'
  );

  const forms = connection.querySelectorAll(
    '.connection-form'
  );

  const showForm = (activeButton) => {
    const formType = activeButton.dataset.form;
    const activeForm = connection.querySelector(
      `#${formType}-form`
    );

    if (!activeForm) {
      return;
    }

    buttons.forEach((button) => {
      const isActive = button === activeButton;

      button.classList.toggle(
        'connection__switch--active',
        isActive
      );

      button.setAttribute(
        'aria-selected',
        String(isActive)
      );

      button.tabIndex = isActive ? 0 : -1;
    });

    forms.forEach((form) => {
      const isActive = form === activeForm;

      form.classList.toggle(
        'connection-form--active',
        isActive
      );

      form.hidden = !isActive;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      showForm(button);
    });
  });

  const activeButton = connection.querySelector(
    '.connection__switch--active'
  );

  if (activeButton) {
    showForm(activeButton);
  }
};
const initContract = () => {
  const contract = document.querySelector('.contract');
  const modal = document.querySelector('[data-contract-modal]');

  if (!contract || !modal) {
    return;
  }

  const openButton = contract.querySelector(
    '[data-contract-open]'
  );

  const closeButtons = modal.querySelectorAll(
    '[data-contract-close]'
  );

  const printButton = contract.querySelector(
    '[data-contract-print]'
  );

  const agreement = contract.querySelector(
    '#contract-agreement'
  );

  const submitButton = contract.querySelector(
    '[data-contract-submit]'
  );

  openButton?.addEventListener('click', () => {
    modal.showModal();
    document.body.classList.add('scroll-lock');
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      modal.close();
    });
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  modal.addEventListener('close', () => {
    document.body.classList.remove('scroll-lock');
  });

  printButton?.addEventListener('click', () => {
    modal.showModal();

    requestAnimationFrame(() => {
      window.print();
    });
  });

  agreement?.addEventListener('change', () => {
    submitButton.disabled = !agreement.checked;
  });

};
const initConnectionAgreements = () => {
  const forms = document.querySelectorAll(
    '.connection-form'
  );

  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    const requiredCheckboxes = form.querySelectorAll(
      'input[type="checkbox"][required]'
    );

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    if (!requiredCheckboxes.length || !submitButton) {
      return;
    }

    const updateSubmitButton = () => {
      const allChecked = Array.from(
        requiredCheckboxes
      ).every((checkbox) => checkbox.checked);

      submitButton.disabled = !allChecked;
    };

    requiredCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener(
        'change',
        updateSubmitButton
      );
    });

    updateSubmitButton();
  });
};

const initCheckoutFlow = () => {
  const calculator = document.querySelector('#calculator');
  const connection = document.querySelector('#connection');
  const contract = document.querySelector('#contract');
  const payment = document.querySelector('#payment');

  const scrollToSection = (section) => {
    if (!section) {
      return;
    }

    const headerHeight =
      document.querySelector('.header')?.offsetHeight || 0;
    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      16;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  };

  document.querySelectorAll('[data-go-calculator]').forEach((button) => {
    button.addEventListener('click', () => {
      scrollToSection(calculator);
    });
  });

  calculator
    ?.querySelector('[data-calculator-continue]')
    ?.addEventListener('click', () => {
      scrollToSection(connection);
    });

  connection?.querySelectorAll('.connection-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      scrollToSection(contract);
    });
  });

  contract
    ?.querySelector('[data-contract-submit]')
    ?.addEventListener('click', (event) => {
      if (event.currentTarget.disabled) {
        return;
      }

      scrollToSection(payment);
    });
};

const initPayment = () => {
  const payment = document.querySelector('.payment');

  if (!payment) {
    return;
  }

  const methods = payment.querySelectorAll('.payment-method');
  const methodInputs = payment.querySelectorAll('.payment-method__input');
  const buttonText = payment.querySelector('[data-payment-button-text]');
  const employeesOutput = payment.querySelector('[data-payment-employees]');
  const optionsOutput = payment.querySelector('[data-payment-options]');
  const totalOutput = payment.querySelector('[data-payment-total]');
  const priceOutput = payment.querySelector('[data-payment-price]');
  const calculator = document.querySelector('.calculator');
  const customerTypeButtons = document.querySelectorAll('.connection__switch[data-form]');
  const paymentForm = payment.querySelector('[data-payment-form]');
  const paymentHeader = payment.querySelector('.payment__header');
  const paymentTrust = payment.querySelector('.payment-trust');
  const paymentSuccess = payment.querySelector('[data-payment-success]');
  const paymentFailure = payment.querySelector('[data-payment-failure]');
  const retryButton = payment.querySelector('[data-payment-retry]');

  const updateMethod = () => {
    methodInputs.forEach((input) => {
      input.closest('.payment-method')?.classList.toggle('payment-method--active', input.checked);
    });

    const selected = payment.querySelector('.payment-method__input:checked');
    const labels = {
      card: 'Перейти к оплате',
      invoice: 'Получить счёт',
      sbp: 'Показать QR-код'
    };

    if (buttonText && selected) {
      buttonText.textContent = labels[selected.value] || 'Продолжить';
    }
  };

  const updateOrder = () => {
    if (!calculator) {
      return;
    }

    const employees = Number(calculator.querySelector('.calculator-employees__input')?.value) || 0;
    const price = getPricePerEmployee(employees);
    const optionInputs = document.querySelectorAll(
      '.calculator .checkbox__input[data-price], .services-modal .checkbox__input[data-price]'
    );
    let optionsPrice = 0;

    optionInputs.forEach((input) => {
      if (input.checked) {
        optionsPrice += Number(input.dataset.price) || 0;
      }
    });

    const total = employees * price + optionsPrice;

    if (employeesOutput) employeesOutput.textContent = employees.toLocaleString('ru-RU');
    if (priceOutput) priceOutput.textContent = `${price.toLocaleString('ru-RU')} ₽`;
    if (optionsOutput) optionsOutput.textContent = `${optionsPrice.toLocaleString('ru-RU')} ₽`;
    if (totalOutput) totalOutput.textContent = `${total.toLocaleString('ru-RU')} ₽`;
  };

  const updateCustomerType = (customerType) => {
    const isCompany = customerType === 'company';
    const cardInput = payment.querySelector('input[value="card"]');
    const invoiceInput = payment.querySelector('input[value="invoice"]');
    const sbpInput = payment.querySelector('input[value="sbp"]');

    payment.classList.toggle('payment--company', isCompany);

    if (sbpInput) {
      sbpInput.disabled = isCompany;
    }

    const preferredInput = isCompany ? invoiceInput : cardInput;

    if (preferredInput) {
      preferredInput.checked = true;
    }

    updateMethod();
  };

  const hidePaymentForm = () => {
    paymentForm.hidden = true;
    if (paymentHeader) paymentHeader.hidden = true;
    if (paymentTrust) paymentTrust.hidden = true;
  };

  const restorePaymentForm = () => {
    paymentForm.hidden = false;
    if (paymentHeader) paymentHeader.hidden = false;
    if (paymentTrust) paymentTrust.hidden = false;
    if (paymentSuccess) paymentSuccess.hidden = true;
    if (paymentFailure) paymentFailure.hidden = true;
    payment.querySelector('.payment-method__input:checked')?.focus();
    payment.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showPaymentFailure = () => {
    if (!paymentFailure) {
      return;
    }

    const selectedMethod = payment.querySelector('.payment-method__input:checked');
    const selectedLabel = selectedMethod
      ?.closest('.payment-method')
      ?.querySelector('.payment-method__content strong')
      ?.textContent;
    const failureTotal = paymentFailure.querySelector('[data-payment-failure-total]');
    const failureMethod = paymentFailure.querySelector('[data-payment-failure-method]');

    hidePaymentForm();
    if (paymentSuccess) paymentSuccess.hidden = true;
    paymentFailure.hidden = false;

    if (failureTotal && totalOutput) {
      failureTotal.textContent = totalOutput.textContent;
    }

    if (failureMethod && selectedLabel) {
      failureMethod.textContent = selectedLabel;
    }

    paymentFailure.querySelector('.payment-failure__title')?.focus();
    payment.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showPaymentSuccess = () => {
    if (!paymentSuccess) {
      return;
    }

    hidePaymentForm();
    if (paymentFailure) paymentFailure.hidden = true;
    paymentSuccess.hidden = false;
    paymentSuccess.querySelector('.payment-success__title')?.focus();
    payment.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  methodInputs.forEach((input) => input.addEventListener('change', updateMethod));
  customerTypeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updateCustomerType(button.dataset.form);
    });
  });
  calculator?.addEventListener('input', updateOrder);
  calculator?.addEventListener('change', updateOrder);
  calculator?.addEventListener('calculator:updated', updateOrder);

  paymentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    showPaymentSuccess();
  });

  retryButton?.addEventListener('click', restorePaymentForm);
  payment.addEventListener('payment:succeeded', showPaymentSuccess);
  payment.addEventListener('payment:failed', showPaymentFailure);

  methods.forEach((method) => {
    method.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        method.querySelector('input')?.click();
      }
    });
  });

  const activeCustomerType = document.querySelector('.connection__switch--active[data-form]')?.dataset.form;
  updateCustomerType(activeCustomerType || 'person');
  updateOrder();

  if (new URLSearchParams(window.location.search).get('payment') === 'failed') {
    showPaymentFailure();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initCalculator();
  initServicesModal();
  initConsultationModal();
  initFormSwitcher();
  initContract();
  initConnectionAgreements();
  initCheckoutFlow();
  initPayment();
});
