//represents each individual transaction
class Transaction {
  constructor(amount, description, date, id) {
    this.amount = parseFloat(amount);
    this.description = description;
    this.date = date;
    this.transactionId = id;
  }
};

//tracks each individual transactions
class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
  }

  //create a new transaction and inserts it into the appropriate list
  addNewTransaction(amount, description, date) {

    if ((amount !== "") && (amount !== "0") && (description !== "")) {

      if (amount > 0) {
        this.incomeList.push(new Transaction(amount, description, date, this.id));
      } else {
        this.expenseList.push(new Transaction(amount, description, date, this.id));
      }

      this.id++;
      this.updateEachTotal();
      this.updateIncomeList();
      this.updateExpenseList();
      this.activateDeleteButton();
    }
  }

  // removes transaction object from the appropriate list based on unique id
  removeTransaction(id) {
    let incomeMatched = this.incomeList.find(element => element.transactionId === id);
    
    if (incomeMatched) {
      this.incomeList.splice(this.incomeList.findIndex(function (inc) {
        return inc.transactionId === id;
      }), 1);
    } else {
      this.expenseList.splice(this.expenseList.findIndex(function (exp) {
        return exp.transactionId === id;
      }), 1);
    }

    this.updateEachTotal();
    this.updateIncomeList();
    this.updateExpenseList();
    this.activateDeleteButton();
  }

  //count and update each total
  updateEachTotal() {
    let incomeSum = 0;
    let expenseSum = 0;
    let grandTotal = 0;
    this.incomeList.forEach(element => { incomeSum += element.amount; });
    this.expenseList.forEach(element => { expenseSum += element.amount; });
    expenseSum = -expenseSum;
    grandTotal = incomeSum - expenseSum;

    //update sum of each incomes, sum of each expenses
    document.querySelector('.budget__income--value').innerHTML = `+ $${incomeSum.toFixed(2)}`;
    document.querySelector('.budget__expenses--value').innerHTML = `- $${expenseSum.toFixed(2)}`;

    //update expense percetage relative to the total income
    let percentage = document.querySelector('.budget__expenses--percentage');

    if ((incomeSum === 0) && (expenseSum === 0)) {
      percentage.innerHTML = `0%`;
    } else {
      percentage.innerHTML = `${((100 * expenseSum) / incomeSum).toFixed(0)}%`;
    }

    //update grand total
    let budgetValue = document.querySelector('.budget__value');

    if (grandTotal > 0) {
      budgetValue.innerHTML = `+$${grandTotal.toFixed(2)}`;
    } else {
      budgetValue.innerHTML = `-$${(-grandTotal).toFixed(2)}`;
    }
  }

  //updates income list
  updateIncomeList() {
    let incList = document.querySelector('.income__list');
    incList.innerHTML = "";

    this.incomeList.forEach((transaction) => {
      incList.innerHTML +=
        `<div class="item" data-transaction-id="${transaction.transactionId}">
        <div class="item__description">${transaction.description}</div>
        <div class="right">
          <div class="item__value">+ $${transaction.amount.toFixed(2)}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${transaction.date}</div>
      </div>`;
    });
  }

  //updates expense list
  updateExpenseList() {
    let expList = document.querySelector('.expenses__list');
    expList.innerHTML = "";
    let incomeSum = 0;
    this.incomeList.forEach(element => {
      incomeSum += element.amount;
    });
    
    this.expenseList.forEach((transaction) => {
      expList.innerHTML +=
        `<div class="item" data-transaction-id="${transaction.transactionId}">
        <div class="item__description">${transaction.description}</div>
        <div class="right">
          <div class="item__value">- $${(-transaction.amount).toFixed(2)}</div>
          <div class="item__percentage">${(-(100 * transaction.amount) / incomeSum).toFixed(0)}%</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${transaction.date}</div>
      </div>`;
    });
  }

  //add event listener to delete button
  activateDeleteButton() {
    document.querySelectorAll('.item__delete--btn').forEach(btn => btn.addEventListener('click', function (e) {
      let transactionToDelete = e.target.parentNode.parentNode.parentNode.parentNode;
      transactionList.removeTransaction(parseInt(transactionToDelete.dataset.transactionId));
    }));
  }
};

let transactionList = new TransactionList();
let date = new Date();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let titleMonth = document.querySelector('.budget__title--month');
titleMonth.innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;

//add event listener to add button 
let addBtn = document.querySelector('button.add__btn');
addBtn.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = document.querySelector('.add__value');
  let description = document.querySelector('.add__description');
  let today = `${months[date.getMonth()].slice(0, 3)}. ${date.getDate()}th, ${date.getFullYear()}`;

  //adds new transaction to appropriate list and clear inputs
  transactionList.addNewTransaction(amount.value, description.value, today);
  amount.value = "";
  description.value = "";
});
