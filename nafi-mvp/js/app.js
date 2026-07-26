
const range = document.querySelector('.calculator-range__input');
const valueElement = document.querySelector('.calculator-range__value');
const valueEmployees = document.querySelector('.calculator-employees__input');
const resultEmployees = document.querySelector('[data-employees]');
const resultPrice = document.querySelector('[data-price]');
const resultOptions = document.querySelector('[data-options]');
const resultTotal = document.querySelector('[data-total]');
const checkboxes = document.querySelectorAll('.checkbox__input');

function updateCalculator() {
  const employees = Number(valueEmployees.value);

  // Синхронизация элементов
  range.value = employees;
  valueEmployees.value = employees;

  valueElement.textContent = `${employees} сотрудников`;
  resultEmployees.textContent = `${employees} сотрудников`;

  // Цена
  let price = 490;

  resultPrice.textContent = `${price} ₽`;

  // Дополнительные услуги
  let optionsPrice = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      optionsPrice += Number(checkbox.dataset.price);
    }
  });

  resultOptions.textContent = `+${optionsPrice.toLocaleString('ru-RU')} ₽`;


  // Итог
  const total = employees * price + optionsPrice;

  resultTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}
range.addEventListener('input', () => {
  valueEmployees.value = range.value;
  updateCalculator();
});

valueEmployees.addEventListener('input', () => {
  updateCalculator();
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    updateCalculator();
  });
});
updateCalculator();