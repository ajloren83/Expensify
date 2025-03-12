import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

export function setupFirestore(db, auth) {
    const addExpenseBtn = document.getElementById("add-expense-btn");
    const addExpensePopup = document.getElementById("add-expense-popup");
    const closeBtn = document.querySelector(".close-btn");
    const addExpenseForm = document.getElementById("add-expense");

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
        const status = remaining === 0 ? "Paid" : "Pending";

        if (expenseName && toPay > 0 && willPay >= 0) {
            await addDoc(collection(db, "expenses"), {
                user: auth.currentUser.uid,
                expenseName,
                toPay,
                willPay,
                remaining,
                status
            });
            alert("Expense added!");
            addExpensePopup.style.display = "none";
            loadExpenses();
        } else {
            alert("Enter valid expense details!");
        }
    });

    // Load expenses
    async function loadExpenses() {
        const expenseList = document.getElementById("expense-list");
        expenseList.innerHTML = "";
        const q = query(collection(db, "expenses"), where("user", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const row = `<tr>
                <td>${data.expenseName}</td>
                <td>${data.toPay}</td>
                <td>${data.willPay}</td>
                <td>${data.remaining}</td>
                <td>${data.status}</td>
                <td><button class="delete-btn" data-id="${doc.id}"><i class="fas fa-trash"></i></button></td>
            </tr>`;
            expenseList.innerHTML += row;
        });

        // Add delete event listeners
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const expenseId = button.getAttribute("data-id");
                deleteExpense(expenseId);
            });
        });
    }

    // Delete expense
    async function deleteExpense(expenseId) {
        await deleteDoc(doc(db, "expenses", expenseId));
        alert("Expense deleted!");
        loadExpenses();
    }
}