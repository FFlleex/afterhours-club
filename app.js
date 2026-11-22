const zoneNames = { base: 'BASE', pro: 'PRO', bootcamp: 'BOOTCAMP' };
const rates = { base: 250, pro: 350, bootcamp: 600 };
const form = document.querySelector('#booking-form');
const { zone, seats, day, time, length } = form.elements;
const cost = document.querySelector('#total');
const confirmation = document.querySelector('#confirmation');

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0
});
const displayDate = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Moscow', dateStyle: 'long', timeStyle: 'short'
});
const dateParts = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit'
});

function updateEstimate() {
  cost.value = money.format(rates[zone.value] * Number(seats.value) * Number(length.value));
}

function clearConfirmation() {
  time.setCustomValidity('');
  confirmation.textContent = '';
  updateEstimate();
}

const nextHour = new Date(Math.ceil((Date.now() + 1) / 3600000) * 3600000);
day.min = dateParts.format(new Date());
day.value = dateParts.format(nextHour);
time.value = nextHour.toLocaleTimeString('sv-SE', {
  timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false
});
updateEstimate();

document.querySelectorAll('[data-zone]').forEach((link) => {
  link.addEventListener('click', () => {
    zone.value = link.dataset.zone;
    clearConfirmation();
    zone.focus({ preventScroll: true });
  });
});

form.addEventListener('input', clearConfirmation);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const startsAt = new Date(`${day.value}T${time.value}:00+03:00`);
  if (startsAt <= new Date()) {
    time.setCustomValidity('Выберите время в будущем по Казани.');
    time.reportValidity();
    return;
  }
  const endsAt = new Date(startsAt.getTime() + Number(length.value) * 3600000);
  confirmation.textContent = `Демобронь подтверждена. ${zoneNames[zone.value]} · мест: ${seats.value}. ${displayDate.formatRange(startsAt, endsAt)} · ${cost.value}.`;
});
