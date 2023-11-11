document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const createBookItem = (title, author, year, isComplete) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.dataset.title = title;
    bookItem.dataset.author = author;
    bookItem.dataset.year = year;
    bookItem.dataset.isComplete = isComplete;

    bookItem.innerHTML = `
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
      <div class="action">
        <button class="green">${isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca'}</button>
        <button class="red">Hapus buku</button>
      </div>
    `;

    return bookItem;
  };

  const addBookToStorage = () => {
    const incompleteBookItems = document.querySelectorAll("#incompleteBookshelfList .book_item");
    const completeBookItems = document.querySelectorAll("#completeBookshelfList .book_item");

    const books = [];
    incompleteBookItems.forEach(book => {
      books.push({
        title: book.dataset.title,
        author: book.dataset.author,
        year: book.dataset.year,
        isComplete: book.dataset.isComplete === "true"
      });
    });

    completeBookItems.forEach(book => {
      books.push({
        title: book.dataset.title,
        author: book.dataset.author,
        year: book.dataset.year,
        isComplete: book.dataset.isComplete === "true"
      });
    });

    localStorage.setItem("books", JSON.stringify(books));
  };

  const loadBooksFromStorage = () => {
    const books = localStorage.getItem("books");
    if (books) {
      const parsedBooks = JSON.parse(books);
      parsedBooks.forEach(book => {
        const newBookItem = createBookItem(book.title, book.author, book.year, book.isComplete);
        if (book.isComplete) {
          completeBookshelfList.appendChild(newBookItem);
        } else {
          incompleteBookshelfList.appendChild(newBookItem);
        }
      });
    }
  };

  const addBook = () => {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const bookItem = createBookItem(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

    if (inputBookIsComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }

    addBookToStorage();
  };

  const removeBookFromStorage = (bookItem) => {
    const books = JSON.parse(localStorage.getItem("books"));
    const index = books.findIndex(book => book.title === bookItem.dataset.title &&
      book.author === bookItem.dataset.author &&
      book.year === bookItem.dataset.year &&
      book.isComplete.toString() === bookItem.dataset.isComplete);

    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
  };

  document.addEventListener("click", function (event) {
    if (event.target.className === "green") {
      const bookItem = event.target.parentElement.parentElement;
      const targetShelf = bookItem.dataset.isComplete === "true" ? incompleteBookshelfList : completeBookshelfList;

      if (targetShelf === incompleteBookshelfList) {
        bookItem.dataset.isComplete = "false";
        event.target.innerText = "Selesai dibaca";
      } else {
        bookItem.dataset.isComplete = "true";
        event.target.innerText = "Belum selesai di Baca";
      }

      targetShelf.appendChild(bookItem);
      addBookToStorage();
    }

    if (event.target.className === "red") {
      const bookItem = event.target.parentElement.parentElement;
      bookItem.remove();
      removeBookFromStorage(bookItem);
    }
  });

  loadBooksFromStorage();
});