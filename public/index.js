let rowIdCounter = 1;
const apiUrl = "http://localhost:3000/books";
let booksData = []; // To store books data locally

function displayBooks() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      booksData = data; // Store fetched data locally
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
    const bookYear = new Date(book.year).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const row = `
      <tr id="row${index + 1}">
        <td>${index + 1}</td>
        <td contenteditable="false" id="title_${index + 1}">${book.title}</td>
        <td contenteditable="false" id="author_${index + 1}">${book.author}</td>
        <td contenteditable="false" id="genre_${index + 1}">${book.genre}</td>
        <td contenteditable="false" id="year_${
          index + 1
        }">${bookYear}</td> <!-- Use formatted date -->
        <td contenteditable="false" id="isbn_${index + 1}">${book.isbn}</td>
        <td>
          <button onclick="edit_row(${index + 1})">Edit</button>
          <button onclick="deleteBook('${book._id}')">Delete</button>
          <button style="display:none" onclick="updateBook('${book._id}', ${
      index + 1
    })">Update</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

function add_row() {
  const table = document.getElementById("data_table");

  // Creating a new empty row
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

  // Inserting the new row after the table heading
  const headerRow = table.querySelector("tr");
  headerRow.insertAdjacentHTML("afterend", newRow);

  // Update serial numbers for all rows

  document.getElementById("new_title").focus();
}

function saveNewBook() {
  const title = document.getElementById("new_title").innerText.trim();
  const author = document.getElementById("new_author").innerText.trim();
  const genre = document.getElementById("new_genre").innerText.trim();
  const year = document.getElementById("new_year").value;
  const isbn = document.getElementById("new_isbn").innerText.trim();

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

  const data = {
    title: title,
    author: author,
    genre: genre,
    year: year,
    isbn: isbn,
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
      booksData.push(data); // Add the new book to the booksData array
      displayBooks(); // Re-render the table with updated data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function edit_row(rowId) {
  const row = document.getElementById(`row${rowId}`);
  const buttons = row.getElementsByTagName("button");
  buttons[0].style.display = "none"; // Hide Edit button
  buttons[2].style.display = "inline-block"; // Show Update button

  const cells = row.getElementsByTagName("td");
  for (let i = 1; i <= 5; i++) {
    cells[i].contentEditable = true; // Enable content editing
  }
  document.getElementById(`title_${rowId}`).focus();
}

function updateBook(bookId, rowId) {
  const title = document.getElementById(`title_${rowId}`).innerText.trim();
  const author = document.getElementById(`author_${rowId}`).innerText.trim();
  const genre = document.getElementById(`genre_${rowId}`).innerText.trim();
  const year = document.getElementById(`year_${rowId}`).innerText.trim();
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
  fetch(`${apiUrl}/${bookId}`, {
    method: "DELETE",
  })
    .then(() => {
      booksData = booksData.filter((book) => book._id !== bookId);
      renderBooksTable();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

displayBooks();
