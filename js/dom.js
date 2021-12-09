const UNCOMPLETED_READ_BOOK_ID = "books";
const COMPLETED_READ_BOOK_ID = "completed-books";
const BOOK_ITEM_ID = "itemId";

function addBooks() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_READ_BOOK_ID);

    const titleBook = document.getElementById("title").value;
    const authorBook = document.getElementById("author").value;
    const yearBook = document.getElementById("year").value;
    const isCompleted = document.getElementById("isCompleted")
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
    if (document.getElementById("isCompleted").checked == true){
        isCompleted.checked = true;
        const book = makeListBook(titleBook, authorBook, yearBook, isCompleted.checked);
        const bookObject = composeBookObject(titleBook, authorBook, yearBook, isCompleted.checked)
    
        book[BOOK_ITEM_ID] = bookObject.id;
        books.push(bookObject);
    
        completedBookList.append(book);
    } else {
        isCompleted.checked = false;
        const book = makeListBook(titleBook, authorBook, yearBook, isCompleted.checked);
        const bookObject = composeBookObject(titleBook, authorBook, yearBook, isCompleted.checked)
    
        book[BOOK_ITEM_ID] = bookObject.id;
        books.push(bookObject);
    
        uncompletedBookList.append(book);
    }
    updateDataToStorage();
}

function makeListBook(title, author, year, isCompleted) {

    const titleBook = document.createElement("h3");
    titleBook.innerText = title;

    const authorBook = document.createElement("h5");
    authorBook.innerText = author;

    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(titleBook, authorBook, textTimestamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);


    if(isCompleted) {
        container.append(
            createTrashButton(),
            createUndoButton()
        );
    } else {
        container.append(createDoneButton())
    }

    return container;
}

function addTaskToCompleted(taskElement) {
    const listCompleted  = document.getElementById(COMPLETED_READ_BOOK_ID);
    const taskTitle = taskElement.querySelector(".inner > h3").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h5").innerText;
    const taskYear = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeListBook(taskTitle, taskAuthor, taskYear, true);
    
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = true;
    newTodo[BOOK_ITEM_ID] = book.id;
    listCompleted.append(newTodo);

    taskElement.remove();

    updateDataToStorage();
}

function undoTaskFromCompleted(taskElement) {
    const listUncompleted  = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
    const taskTitle = taskElement.querySelector(".inner > h3").innerText;
    const taskAuthor = taskElement.querySelector(".inner > h5").innerText;
    const taskYear = taskElement.querySelector(".inner > p").innerText;

    const newTodo = makeListBook(taskTitle, taskAuthor, taskYear, false);
    
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = false;
    newTodo[BOOK_ITEM_ID] = book.id;

    listUncompleted.append(newTodo);

    taskElement.remove();

    updateDataToStorage();
}

function buttonDone(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerHTML="Selesai";
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function buttonTrash(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerHTML="Hapus";
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function buttonUndo(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerHTML="Baca Ulang";
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function createDoneButton() {
    return buttonDone("done-button", function(event){
        addTaskToCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return buttonTrash("trash-button", function(event){
        removeTaskFromComplated(event.target.parentElement);
    });
}

function createUndoButton() {
    return buttonUndo("undo-button", function(event){
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function removeTaskFromComplated(taskElement) {
    const bookPossition = findBookIndex(taskElement[BOOK_ITEM_ID]);
    books.splice(bookPossition, 1);

    taskElement.remove();
    updateDataToStorage();

    taskElement.remove();
}

//https://stackoverflow.com/questions/42197201/filter-data-from-local-storage