import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

export function setupFirestore(db, auth) {
    const addExpenseBtn = document.getElementById("add-expense-btn");
    const addExpensePopup = document.getElementById("add-expense-popup");
    const closeBtn = document.querySelector(".close-btn");
    const addExpenseForm = document.getElementById("add-expense");

    const salaryInput = document.getElementById("salary");
    const setSalaryBtn = document.getElementById("set-salary");

    // Load salary and expenses on page load or login
    auth.onAuthStateChanged(user => {
        if (user) {
            loadSalary();
            loadExpenses();
        }
    });

    // Open popup
    addExpenseBtn.addEventListener("click", () => {
        addExpensePopup.style.display = "flex";
    });

    // Close popup
    closeBtn.addEventListener("click", () => {
        addExpensePopup.style.display = "none";
    });

    // Add expense
    addExpenseForm.addEventListener("click", async () => {
        const expenseName = document.getElementById("expense-name").value;
        const toPay = Number(document.getElementById("to-pay").value);
        const willPay = Number(document.getElementById("will-pay").value);
        const remaining = toPay - willPay;
        const status = "Unpaid"; // Default status

        if (expenseName && toPay > 0 && willPay >= 0) {
            const selectedMonth = new Date().getMonth() + 1; // Current month (1-12)
            const selectedYear = new Date().getFullYear(); // Current year

            await addDoc(collection(db, "expenses"), {
                user: auth.currentUser.uid,
                expenseName,
                toPay,
                willPay,
                remaining,
                status,
                month: selectedMonth, // Add month
                year: selectedYear // Add year
            });
            alert("Expense added!");
            addExpensePopup.style.display = "none";
            loadExpenses();
            updateBalance(); // Update the balance after adding an expense
        } else {
            alert("Enter valid expense details!");
        }
    });

    // Set Monthly Salary
    setSalaryBtn.addEventListener("click", async () => {
        const salary = Number(salaryInput.value);
        if (salary > 0) {
            const selectedMonth = new Date().getMonth() + 1; // Current month (1-12)
            const selectedYear = new Date().getFullYear(); // Current year

            // Save salary to Firestore
            await addDoc(collection(db, "salary"), {
                user: auth.currentUser.uid,
                month: selectedMonth,
                year: selectedYear,
                salary: salary
            });
            alert("Salary set successfully!");
            updateBalance(); // Update the balance after setting salary
        } else {
            alert("Enter a valid salary!");
        }
    });

    // Load salary
    async function loadSalary() {
        const selectedMonth = new Date().getMonth() + 1; // Current month (1-12)
        const selectedYear = new Date().getFullYear(); // Current year

        const salaryQuery = query(collection(db, "salary"), where("user", "==", auth.currentUser.uid), where("month", "==", selectedMonth), where("year", "==", selectedYear));
        const salarySnapshot = await getDocs(salaryQuery);

        salarySnapshot.forEach(doc => {
            const salary = doc.data().salary;
            document.getElementById("salary").value = salary; // Set salary input value
        });
    }

    // Load expenses
    async function loadExpenses() {
        const expenseList = document.getElementById("expense-list");
        expenseList.innerHTML = "";
        const selectedMonth = new Date().getMonth() + 1; // Current month (1-12)
        const selectedYear = new Date().getFullYear(); // Current year

        const q = query(collection(db, "expenses"), where("user", "==", auth.currentUser.uid), where("month", "==", selectedMonth), where("year", "==", selectedYear));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const row = `<tr>
                <td>${data.expenseName}</td>
                <td>${data.toPay}</td>
                <td>${data.willPay}</td>
                <td>${data.remaining}</td>
                <td>${data.status}</td>
                <td>
                    ${data.status === "Unpaid" ? `<button class="check-btn" data-id="${doc.id}"><i class="fas fa-check"></i></button>` : ''}
                    <button class="delete-btn" data-id="${doc.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
            expenseList.innerHTML += row;
        });

        // Add event listeners for check buttons
        document.querySelectorAll(".check-btn").forEach(button => {
            button.addEventListener("click", () => {
                const expenseId = button.getAttribute("data-id");
                markAsPaid(expenseId);
            });
        });

        // Add event listeners for delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const expenseId = button.getAttribute("data-id");
                deleteExpense(expenseId);
            });
        });

        updateBalance(); // Update the balance after loading expenses
    }

    // Mark expense as Paid
    async function markAsPaid(expenseId) {
        const expenseRef = doc(db, "expenses", expenseId);
        await updateDoc(expenseRef, {
            status: "Paid"
        });
        alert("Expense marked as Paid!");
        loadExpenses(); // Refresh the expense list
        updateBalance(); // Update the balance after marking as paid
    }

    // Delete expense
    async function deleteExpense(expenseId) {
        await deleteDoc(doc(db, "expenses", expenseId));
        alert("Expense deleted!");
        loadExpenses();
        updateBalance(); // Update the balance after deleting an expense
    }

    // Update Balance
    async function updateBalance() {
        const selectedMonth = new Date().getMonth() + 1; // Current month (1-12)
        const selectedYear = new Date().getFullYear(); // Current year

        let salary = 0;
        let totalExpenses = 0;

        // Fetch salary
        const salaryQuery = query(collection(db, "salary"), where("user", "==", auth.currentUser.uid), where("month", "==", selectedMonth), where("year", "==", selectedYear));
        const salarySnapshot = await getDocs(salaryQuery);
        salarySnapshot.forEach(doc => salary = doc.data().salary);

        // Fetch expenses
        const expenseQuery = query(collection(db, "expenses"), where("user", "==", auth.currentUser.uid), where("month", "==", selectedMonth), where("year", "==", selectedYear));
        const expenseSnapshot = await getDocs(expenseQuery);
        expenseSnapshot.forEach(doc => {
            totalExpenses += doc.data().willPay; // Use willPay instead of toPay
        });

        // Update balance display
        document.getElementById("balance").innerText = salary - totalExpenses;
    }
}