let rowIdCounter = 1;
const apiUrl = "http://localhost:3000/books";
let booksData = [];

document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Thank you for submitting your details!");
    saveNewBook();
  });
function displayBooks() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      booksData = data;
      renderBooksTable();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function renderBooksTable() {
  const table = document.getElementById("data_table");
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Title</th>
      <th>Author</th>
      <th>Genre</th>
      <th>Year of Publication</th>
      <th>ISBN</th>
      <th>Actions</th>
    </tr>
  `;

  booksData.forEach((book, index) => {
    const bookYear = new Date(book.year).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const row = `
    <tr data-book-id="${book._id}" id="row${index + 1}">
        <td>${index + 1}</td>
        <td contenteditable="false" id="title_${index + 1}">${book.title}</td>
        <td contenteditable="false" id="author_${index + 1}">${book.author}</td>
        <td contenteditable="false" id="genre_${index + 1}">${book.genre}</td>
        <td contenteditable="false" id="year_${index + 1}">${bookYear}</td>
        <td contenteditable="false" id="isbn_${index + 1}">${book.isbn}</td>
        <td>
          <button id="edit_${index + 1}" onclick="edit_row(${
      index + 1
    })">Edit</button>
          <button style="display:none" id="update_${
            index + 1
          }" onclick="updateBook('${book._id}', ${index + 1})">Update</button>
          <button id="delete_${index + 1}" onclick="deleteBook('${
      book._id
    }')">Delete</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function add_row() {
  const userName = document.getElementById("userName").value;
  const userEmail = document.getElementById("userEmail").value;
  const userPhone = document.getElementById("userPhone").value;

  if (!userName || !userEmail || !userPhone) {
    alert("Please fill in your name, email, and phone number.");
    return;
  }
  const table = document.getElementById("data_table");

  const newRow = `
    <tr>
      <td>${booksData.length + 1}</td>
      <td contenteditable="true" id="new_title" placeholder="Enter Title"></td>
      <td contenteditable="true" id="new_author" placeholder="Enter Author"></td>
      <td contenteditable="true" id="new_genre" placeholder="Enter Genre"></td>
      <td><input type="date" id="new_year" placeholder="Enter Date"></td>
      <td contenteditable="true" id="new_isbn" placeholder="Enter ISBN"></td>
      <td>
        <button onclick="saveNewBook()">Save</button>
      </td>
    </tr>
  `;

  const headerRow = table.querySelector("tr");
  headerRow.insertAdjacentHTML("afterend", newRow);

  document.getElementById("new_title").focus();
}

function saveNewBook() {
  const title = document.getElementById("new_title").innerText.trim();
  const author = document.getElementById("new_author").innerText.trim();
  const genre = document.getElementById("new_genre").innerText.trim();
  const year = document.getElementById("new_year").value;
  const isbn = document.getElementById("new_isbn").innerText.trim();
  const userName = document.getElementById("userName").value;
  const userEmail = document.getElementById("userEmail").value;
  const userPhone = document.getElementById("userPhone").value;

  if (
    title === "" ||
    author === "" ||
    genre === "" ||
    year === "" ||
    isbn === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const enteredDate = new Date(year);
  const today = new Date();

  if (enteredDate > today) {
    alert("Publication year cannot be in the future.");
    return;
  }

  const data = {
    title: title,
    author: author,
    genre: genre,
    year: year,
    isbn: isbn,
    user: {
      name: userName,
      email: userEmail,
      phone: userPhone,
    },
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
      <td>${booksData.length + 1}</td>
      <td>${data.title}</td>
      <td>${data.author}</td>
      <td>${data.genre}</td>
      <td>${new Date(data.year).toLocaleDateString()}</td>
      <td>${data.isbn}</td>
      <td>...buttons...</td>
    `;
      newRow.classList.add("animate-slide-in-down");

      const table = document.getElementById("data_table");
      table.appendChild(newRow);

      newRow.addEventListener("animationend", () => {
        booksData.push(data);
        displayBooks();
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function edit_row(rowId) {
  const currentlyEditingRow = document.querySelector("tr.editing");
  if (currentlyEditingRow) {
    cancelEdit(currentlyEditingRow.id.replace("row", ""));
  }

  const row = document.getElementById(`row${rowId}`);
  row.classList.add("editing");

  const buttons = row.getElementsByTagName("button");

  buttons[0].style.display = "none";
  buttons[1].style.display = "inline-block";

  const cells = row.getElementsByTagName("td");
  for (let i = 1; i <= 5; i++) {
    if (i !== 4) {
      cells[i].contentEditable = true;
    }
  }

  const book = booksData[rowId - 1];
  const bookDate = new Date(book.year);
  const localDate = bookDate.toISOString().split("T")[0];

  cells[4].innerHTML = `<input type="date" id="edit_year_${rowId}" value="${localDate}">`;

  document.getElementById(`title_${rowId}`).focus();
}

function cancelEdit(rowId) {
  const row = document.getElementById(`row${rowId}`);
  row.classList.remove("editing");

  const buttons = row.getElementsByTagName("button");

  buttons[0].style.display = "inline-block";
  buttons[1].style.display = "none";

  const cells = row.getElementsByTagName("td");
  for (let i = 1; i <= 5; i++) {
    cells[i].contentEditable = false;
  }

  const book = booksData[rowId - 1];
  cells[1].innerText = book.title;
  cells[2].innerText = book.author;
  cells[3].innerText = book.genre;
  cells[4].innerText = new Date(book.year).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  cells[5].innerText = book.isbn;
}

function updateBook(bookId, rowId) {
  const title = document.getElementById(`title_${rowId}`).innerText.trim();
  const author = document.getElementById(`author_${rowId}`).innerText.trim();
  const genre = document.getElementById(`genre_${rowId}`).innerText.trim();
  const year = document.getElementById(`edit_year_${rowId}`).value;
  const isbn = document.getElementById(`isbn_${rowId}`).innerText.trim();

  if (
    title === "" ||
    author === "" ||
    genre === "" ||
    year === "" ||
    isbn === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const enteredDate = new Date(year);
  const today = new Date();

  if (enteredDate > today) {
    alert("Publication year cannot be in the future.");
    return;
  }

  const data = {
    title: title,
    author: author,
    genre: genre,
    year: year,
    isbn: isbn,
  };

  fetch(`${apiUrl}/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((updatedBook) => {
      booksData[rowId - 1] = updatedBook;
      renderBooksTable();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteBook(bookId) {
  const rowToDelete = document.querySelector(`tr[data-book-id="${bookId}"]`);
  if (rowToDelete) {
    rowToDelete.classList.add("animate-slide-out-right");

    rowToDelete.addEventListener("animationend", () => {
      fetch(`${apiUrl}/${bookId}`, {
        method: "DELETE",
      })
        .then(() => {
          booksData = booksData.filter((book) => book._id !== bookId);
          rowToDelete.remove();
          renderBooksTable();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
}

displayBooks();
