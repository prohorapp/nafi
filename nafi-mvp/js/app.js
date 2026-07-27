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

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFormSwitcher();
});