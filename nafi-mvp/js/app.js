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
    '[data-price]'
  );

  const resultOptions = calculator.querySelector(
    '[data-options]'
  );

  const resultTotal = calculator.querySelector(
    '[data-total]'
  );

  // Только платные опции калькулятора
  const optionCheckboxes = document.querySelectorAll(
    '.calculator .checkbox__input[data-price]'
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
    const price = 490;

    range.value = employees;
    valueEmployees.value = employees;

    valueElement.textContent =
      `${employees.toLocaleString('ru-RU')} сотрудников`;

    resultEmployees.textContent =
      `${employees.toLocaleString('ru-RU')} сотрудников`;

    resultPrice.textContent =
      `${price.toLocaleString('ru-RU')} ₽`;

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

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFormSwitcher();
  initContract();
  initConnectionAgreements();
});