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
      <th>Actions</th>
    </tr>
  `;

  booksData.forEach((book, index) => {
    const row = `
      <tr id="row${index + 1}">
        <td>${index + 1}</td>
        <td contenteditable="true" id="title_${index + 1}">${book.title}</td>
        <td contenteditable="true" id="author_${index + 1}">${book.author}</td>
        <td>
          <button onclick="updateBook('${book._id}')">Update</button>
          <button onclick="deleteBook('${book._id}')">Delete</button>
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

function edit_row(no) {
  // Disable the 'Edit' button when editing starts
  document
    .getElementById("row" + no)
    .querySelectorAll("button")[0].disabled = true;
}

function update_row(no) {
  const name = document.getElementById(`name_${no}`).innerText;
  const age = document.getElementById(`age_${no}`).innerText;

  // Assuming you have an API or database interaction to update data
  // Here you can make an API call or perform any data update operation

  // For now, log the updated data to the console
  console.log(`Updated Name: ${name}, Updated Age: ${age}`);

  // Enable the 'Edit' button after updating
  document
    .getElementById("row" + no)
    .querySelectorAll("button")[0].disabled = false;
}

function delete_row(no) {
  const row = document.getElementById("row" + no);
  if (row) {
    row.parentNode.removeChild(row);
  }
}

displayBooks();
