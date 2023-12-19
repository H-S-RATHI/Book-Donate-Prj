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
    const row = `
      <tr id="row${index + 1}">
        <td>${index + 1}</td>
        <td contenteditable="false" id="title_${index + 1}">${book.title}</td>
        <td contenteditable="false" id="author_${index + 1}">${book.author}</td>
        <td contenteditable="false" id="genre_${index + 1}">${book.genre}</td>
        <td contenteditable="false" id="year_${index + 1}">${book.year}</td>
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
  const data = {
    title: "New Book Title",
    author: "Author Name",
    genre: "genre",
    year: "12/12/12",
    isbn: "isbn",
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
      displayBooks();
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
}

function updateBook(bookId, rowId) {
  const title = document.getElementById(`title_${rowId}`).innerText;
  const author = document.getElementById(`author_${rowId}`).innerText;
  const genre = document.getElementById(`genre_${rowId}`).innerText;
  const year = document.getElementById(`year_${rowId}`).innerText;
  const isbn = document.getElementById(`isbn_${rowId}`).innerText;

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
