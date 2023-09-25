import inquirer, { Answers } from "inquirer";

// Create an object to store account details
interface ACCOUNTDETAILS {
  accountNumber: string;
  PIN: string;
  balance: number;
  transactions: string[];
}

const accountDetails: ACCOUNTDETAILS = {
  accountNumber: "ak123",
  PIN: "4321",
  balance: 100, // Set an initial balance
  transactions: [], // Store transaction history
};

const atmMachine = async (Account: ACCOUNTDETAILS): Promise<void> => {
try {
  console.log("Welcome to the ATM Machine!");

  let isLogin: Answers = await inquirer.prompt([
    {
      name: "accountNumber",
      type: "string",
      message: "Please enter your Account Number",
    },
    {
      name: "PIN",
      type: "password",
      mask: "*",
      message: "Please enter your PIN Number",
    },
  ]);

  // Check if the Account Number and PIN are correct
  if (isLogin.accountNumber === Account.accountNumber &&isLogin.PIN === Account.PIN) {
    let performAction: boolean = false;

    do {
      let isLoggedIn: Answers = await inquirer.prompt([
        {
          name: "accountInfo",
          type: "list",
          message: "Which action do you want to perform",
          choices: [
            "Check Account Balance",
            "Withdraw Money",
            "Previous Transactions",
          ],
        },
      ]);

      if (isLoggedIn.accountInfo === "Check Account Balance") {
        console.log(`Your current balance is $${Account.balance}`);
      } else if (isLoggedIn.accountInfo === "Withdraw Money") {
        let withdraw: { moneyWithdraw: number } = await inquirer.prompt([
          {
            name: "moneyWithdraw",
            type: "number",
            message: "Please enter the amount you want to withdraw.",
          },
        ]);
        if (withdraw.moneyWithdraw <= Account.balance &&withdraw.moneyWithdraw > 0) {
          Account.balance -= withdraw.moneyWithdraw;
          Account.transactions.push(`Withdrawn: $${withdraw.moneyWithdraw}`);
          console.log(`Withdrawal successful. Your remaining balance is $${Account.balance}`);
        } else {
          console.log("Insufficient funds or an invalid amount.");
        }
      } else if (isLoggedIn.accountInfo === "Previous Transactions") {
        if (Account.transactions.length > 0) {
          console.log("Previous Transactions:");
          Account.transactions.forEach((transaction, index) => {
            console.log(`${index + 1}. ${transaction}`);
          });
        } else {
          console.log("No previous transactions found.");
        }
      }
      let performOtherAction = await inquirer.prompt([
        {
          name: "action",
          type: "confirm",
          message: "Do you want to perform any other transactions?",
        },
      ]);
      if (performOtherAction.action) {
        performAction = true;
      } else {
        Account.transactions = []; // Clear transaction history within the current login session
        performAction = false;
      }
    } while (performAction);
  } else {
    console.log("Please enter the correct Account Number or PIN.");
  }
  console.log("Thank you for using our ATM. Have a great day!");
} catch (error) {
  console.log(error);
  console.log("An error occurred while using the ATM. Please try again later.");
}
};

atmMachine(accountDetails);