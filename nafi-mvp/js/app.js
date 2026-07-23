const usersInput = document.querySelector('#users');
const durationInput = document.querySelector('#duration');
const supportInputs = document.querySelectorAll('input[name="support"]');
const usersValue = document.querySelector('#usersValue');
const selectedPlan = document.querySelector('#selectedPlan');
const totalPrice = document.querySelector('#totalPrice');
const summaryUsers = document.querySelector('#summaryUsers');
const summaryDuration = document.querySelector('#summaryDuration');
const summarySupport = document.querySelector('#summarySupport');
const orderPlan = document.querySelector('#orderPlan');
const orderUsers = document.querySelector('#orderUsers');
const orderDuration = document.querySelector('#orderDuration');
const orderSupport = document.querySelector('#orderSupport');
const orderTotal = document.querySelector('#orderTotal');
const payButton = document.querySelector('#payButton');
const successSection = document.querySelector('#success');
const registrationForm = document.querySelector('#registrationForm');
const pricingButtons = document.querySelectorAll('.pricing-card__btn');
const planCards = document.querySelectorAll('.pricing-card');

const basePrices = {
  Старт: 49000,
  Профи: 79000,
  Премиум: 119000,
};

const planLimits = {
  Старт: 50,
  Профи: 150,
  Премиум: 300,
};

const planNames = ['Старт', 'Профи', 'Премиум'];

const formatPrice = (value) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const calculatePlan = (users) => {
  if (users <= 50) return 'Старт';
  if (users <= 150) return 'Профи';
  return 'Премиум';
};

const calculatePrice = (users, duration, supportCost, plan) => {
  const planPrice = basePrices[plan];
  const durationMultiplier = duration === '1' ? 1 : duration === '3' ? 2.4 : duration === '6' ? 4.2 : 8;
  const participantsFactor = Math.max(1, users / planLimits[plan]);
  return Math.round((planPrice + participantsFactor * 12000 + supportCost) * durationMultiplier / 10) * 10;
};

const updateSummary = () => {
  const users = Number(usersInput.value);
  const duration = durationInput.value;
  const supportCost = [...supportInputs].find((input) => input.checked).value;
  const supportText = supportCost === '0' ? 'Базовая' : 'Расширенная';
  const plan = calculatePlan(users);
  const price = calculatePrice(users, duration, Number(supportCost), plan);

  usersValue.textContent = users;
  selectedPlan.textContent = plan;
  totalPrice.textContent = `${formatPrice(price)} ₽`;
  summaryUsers.textContent = users;
  summaryDuration.textContent = duration;
  summarySupport.textContent = supportText;
  orderPlan.textContent = plan;
  orderUsers.textContent = users;
  orderDuration.textContent = duration;
  orderSupport.textContent = supportText;
  orderTotal.textContent = `${formatPrice(price)} ₽`;
  payButton.textContent = `Оплатить ${formatPrice(price)} ₽`;
};

const setActivePlanCard = (plan) => {
  planCards.forEach((card) => {
    card.classList.toggle('pricing-card--featured', card.dataset.plan === plan);
  });
};

usersInput.addEventListener('input', () => {
  updateSummary();
});

durationInput.addEventListener('change', updateSummary);

supportInputs.forEach((input) => {
  input.addEventListener('change', updateSummary);
});

pricingButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const plan = planCards[index].dataset.plan;
    const recommendedUsers = planLimits[plan];
    usersInput.value = recommendedUsers;
    setActivePlanCard(plan);
    updateSummary();
    document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
  });
});

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!registrationForm.checkValidity()) {
    registrationForm.reportValidity();
    return;
  }
  successSection.hidden = false;
  successSection.scrollIntoView({ behavior: 'smooth' });
});

updateSummary();
