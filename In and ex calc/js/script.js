document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("entry-form");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const entriesList = document.getElementById("entries");
  const totalIncome = document.getElementById("total-income");
  const totalExpense = document.getElementById("total-expense");
  const netBalance = document.getElementById("net-balance");

  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  const renderEntries = (filter = "all") => {
    entriesList.innerHTML = "";

    const filteredEntries = entries.filter((entry) =>
      filter === "all" ? true : entry.type === filter
    );

    filteredEntries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center py-2";

      li.innerHTML = `
        <span class="text-gray-800">${entry.description}</span>
        <span class="text-gray-800">₹${entry.amount.toFixed(2)}</span>
        <span class="text-${entry.type === "income" ? "green" : "red"}-600">${
        entry.type
      }</span>
        <div class="flex space-x-2">
          <button class="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 edit-btn" data-index="${index}">Edit</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 delete-btn" data-index="${index}">Delete</button>
        </div>
      `;
      entriesList.appendChild(li);
    });

    updateTotals();
  };

  const updateTotals = () => {
    const income = entries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const expense = entries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + entry.amount, 0);

    totalIncome.textContent = `₹${income.toFixed(2)}`;
    totalExpense.textContent = `₹${expense.toFixed(2)}`;
    netBalance.textContent = `₹${(income - expense).toFixed(2)}`;
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("entries", JSON.stringify(entries));
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = form.type.value;

    if (!description || isNaN(amount) || amount <= 0)
      return alert("Invalid input!");

    entries.push({ description, amount, type });
    saveToLocalStorage();
    renderEntries();

    form.reset();
  });

  entriesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.dataset.index;
      entries.splice(index, 1);
      saveToLocalStorage();
      renderEntries();
    }

    if (e.target.classList.contains("edit-btn")) {
      const index = e.target.dataset.index;
      const entry = entries[index];

      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      form.type.value = entry.type;

      entries.splice(index, 1);
      saveToLocalStorage();
      renderEntries();
    }
  });

  document.querySelectorAll("[name='filter']").forEach((radio) =>
    radio.addEventListener("change", (e) => {
      renderEntries(e.target.value);
    })
  );

  renderEntries();
});
