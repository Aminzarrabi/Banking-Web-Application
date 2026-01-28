'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovements = acc.movements.map((mov, i) => {
    return {
      movement: mov,
      movementDate: acc.movementsDates.at(i),
    };
  });
  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  if (sort) combinedMovements.sort((a, b) => a.movement - b.movement);

  combinedMovements.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const date = new Date(movementDate);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const display = `${day}/${month}/${year}`;

    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${display}</div>
        <div class="movements__value">${movement.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  const now = new Date();
  const options = {
    second: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat('de-DE', options).format(now);
  // fa-IR 1404/9/16
  //en-US 12/7/2025
  // en-GB 07/12/2025
  // de-DE 7.12.2025, 10:30:17
  const locale = navigator.language;
  console.log(locale); //en-US
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create Date and Time

    // const current = new Date();
    // const current = now;
    // const day = `${current.getDate()}`.padStart(2, 0);
    // const month = `${current.getMonth() + 1}`.padStart(2, 0);
    // const year = current.getFullYear();
    // const hour = current.getHours();
    // const min = current.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Add Transfer Date

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Date of loan
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    console.log(account1);
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Coversion - 3

// console.log(Number('4523'));
// console.log(+'4523');

// console.log(Number.parseInt('1101px', 10)); // decimal
// console.log(Number.parseInt('1101px', 2)); //binary
// console.log(Number.parseInt('p452x', 10)); // should start with number

// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('2.5rem'));

// console.log(Number.isFinite('20')); //check for number
// console.log(Number.isFinite(20));

// Math and Rounding - 4

// console.log(Math.sqrt(25));

// console.log(Math.max(38, 58, 94, 12));
// console.log(Math.min(38, 58, 94, 12));

// console.log(Math.trunc(Math.random() * 6) + 1);
// // The Math.floor() static method always rounds down and returns the largest integer less than or equal to a given number.
// console.log(Math.floor(Math.random() * 6));
// // Random Number Generator
// const randomNum = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// console.log(randomNum(20, 30));

// // The Math.trunc() static method returns the integer part of a number by removing any fractional digits.
// console.log(Math.trunc(100.4));
// // The Math.floor() static method always rounds down and returns the largest integer less than or equal to a given number.
// console.log(Math.floor(99.9));
// // The Math.round() static method returns the value of a number rounded to the nearest integer.
// console.log(Math.round(99.5));
// // The Math.ceil() static method always rounds up and returns the smallest integer greater than or equal to a given number.
// console.log(Math.ceil(99.1));
// // ! Math.Trunc is like Math.Floor for positive numbers, and like Math.Ceiling for negative numbers
// // toFixed() method converts a number to a string rounds the string to a specified number of decimals
// console.log((2.5632).toFixed(2));
// console.log((2.5632).toFixed(7));

// Remainder operator - 5
// const isEven = n => n % 2 === 0;
// console.log(isEven(32));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 2 != 0) {
//       row.style.backgroundColor = 'yellow';
//     }
//   });
// });

// Numeric Separators - 6
// BigInt - 7
// ! math operations do not work on bigint
// console.log(465189413514804n);
// console.log(BigInt(465189413514804));
// console.log(20n === 20);
// console.log(20n == 20);

// Date and Time - 8
// const now = new Date();
// console.log(now);
// console.log(now.getFullYear()); // year
// console.log(now.getMonth()); //month
// console.log(now.getDate()); // day
// console.log(now.getDay()); //day of the week
// console.log(now.getHours());
// console.log(now.getMinutes());
// console.log(now.getSeconds());
// console.log(now.toISOString());
// console.log(now.getTime());

// const future = new Date(2037, 10, 18, 10, 25, 59);
// console.log(future);
// future.setFullYear(2040);
// console.log(future);

// const born = new Date('Fri Jun 6 2003 5:59:59');
// console.log(born);

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// const calcDate = (date1, date2) =>
//   Math.round(Math.round(Math.abs(date2 - date1)) / (1000 * 60 * 60 * 24));

// console.log(
//   calcDate(new Date(2022, 9, 10, 12, 14, 45), new Date(2022, 10, 20, 10, 0, 50))
// );

// const num = 1000000.2;
// const speed = 230;
// const options = {
//   style: 'unit',
//   unit: 'kilometer-per-hour',
// };
// console.log('en-US : ', new Intl.NumberFormat('en-US').format(num));
// console.log('de-DE : ', new Intl.NumberFormat('de-DE', options).format(speed));
// console.log('fa-IR : ', new Intl.NumberFormat('fa-IR').format(num));
// console.log('de-DE : ', new Intl.NumberFormat('de-DE').format(num));

// const pizza = setTimeout(
//   (ing1, ing2) => {
//     console.log(`Here is your pizza with ${ing1} and ${ing2}`);
//   },
//   5000,
//   'olive',
//   'spinach'
// );
// // clearTimeout(pizza)

// var i = 0;
// const counter = setInterval(() => {
//   i++;
//   console.log(i);
//   if (i === 5) clearInterval(counter);
// }, 1000);
