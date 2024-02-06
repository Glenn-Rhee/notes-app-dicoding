const formAdd = document.querySelector("#form-add");
const inputs = document.querySelectorAll(".add-book .input-group input")
const cardUnfinished = document.querySelector("#card-unfinished");
const containerUnfinished = document.querySelector("#section-unfinished")
const cardFinished = document.querySelector("#card-finished")
const containerFinished = document.querySelector("#section-finished");
const btnDelete = document.querySelectorAll(".btn-delete");
const nullDataUnfinished = document.querySelector("#no-data-unfinished");
const nullDataFinished = document.querySelector("#no-data-finished");
const errorInput = document.querySelector(".error-input");

(() => {
    let cards = '';
    let data = getData("data-unfinished");

    if (!data || data.length === 0) {
        nullDataUnfinished.classList.add("show")
    } else {
        nullDataUnfinished.classList.remove("show")
        data.forEach(d => cards += setCardUi(d, "read"));
        cardUnfinished.innerHTML = cards
    }

    cards = '';
    data = getData("data-finished");
    if (!data || data.length === 0) {
        nullDataFinished.classList.add("show-finished")
    } else {
        nullDataFinished.classList.remove("show-finished")
        data.forEach(d => cards += setCardUi(d, "unred"));
        cardFinished.innerHTML = cards
    }
})()


document.addEventListener("click", async function (e) {
    const classElement = e.target.classList
    if (classElement.contains("btn-delete")) {
        const id = parseInt(e.target.dataset.id);
        const parentElement = e.target.parentNode.parentNode.parentNode.id;
        const { isConfirmed } = await Swal.fire({
            title: 'WARNING!',
            text: 'Are you sure want to delete this item?',
            icon: 'warning',
            confirmButtonText: 'Ok',
            showCancelButton: true
        })

        if (!isConfirmed) {
            return
        }

        if (parentElement === "card-unfinished") {
            deleteItem("data-unfinished", id)
        } else {
            deleteItem("data-finished", id)
        }

        window.location.reload()
    } else if (classElement.contains("btn-mark")) {
        const id = parseInt(e.target.dataset.id);
        const parentElement = e.target.parentNode.parentNode.parentNode.id;
        if (parentElement === "card-unfinished") {
            markMessage("data-unfinished", "data-finished", id)
        } else {
            markMessage("data-finished", "data-unfinished", id)
        }

        window.location.reload()
    }
})

function markMessage(key, unotherKey, id) {
    const data = JSON.parse(localStorage.getItem(key));
    let newData = data.filter(d => d.id !== id);
    localStorage.setItem(key, JSON.stringify(newData));
    newData = data.find(d => d.id === id);
    const anotherData = JSON.parse(localStorage.getItem(unotherKey));
    newData = !anotherData ? [newData] : [...anotherData, newData]
    localStorage.setItem(unotherKey, JSON.stringify(newData))
}

function deleteItem(key, id) {
    const data = JSON.parse(localStorage.getItem(key));
    const newData = data.filter(d => d.id !== id);
    localStorage.setItem(key, JSON.stringify(newData));
}

formAdd.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (inputs[0].value === "" || inputs[1].value === "" || inputs[2].value === "") {
        errorInput.innerHTML = "Title, Author, and year of realease are required!";
        errorInput.classList.add("show");
        return
    }

    errorInput.classList.remove("show")
    const data = {
        id: Date.now(),
        title: inputs[0].value,
        author: inputs[1].value,
        year: inputs[2].value,
        isComplete: inputs[3].checked
    }

    const isRegist = isRegistered(data.title, data.author);
    if (isRegist !== "No data") {
        errorInput.innerHTML = isRegist;
        errorInput.classList.add("show")
        return
    }
    errorInput.classList.remove("show")

    data.isComplete ? saveData(data, "data-finished") : saveData(data, "data-unfinished")
    inputs.forEach(input => input.value = "")
    const { isConfirmed } = await Swal.fire({
        title: 'Success!',
        text: "Succes add new book",
        icon: 'success',
        confirmButtonText: 'Ok',
    })

    if (isConfirmed) {
        window.location.reload();
    }

})

function isRegistered(title, author) {
    const user = title.toLowerCase() + author.toLowerCase();
    const dataUnfinished = JSON.parse(localStorage.getItem("data-unfinished"));
    const dataFinished = JSON.parse(localStorage.getItem("data-finished"));
    if (!dataUnfinished && !dataFinished) {
        return "No data"
    }

    if (dataUnfinished) {
        const isRegist = findUser(dataUnfinished, user)
        if (isRegist) {
            return "Data already exist on Unifinished books"
        }

        if (dataFinished) {
            const isRegist = findUser(dataFinished, user)
            if (isRegist) {
                return "Data already exist on Finished books"
            }

            return "No data"
        }

        return "No data"
    } else {
        if (dataFinished) {
            const isRegist = findUser(dataFinished, user)
            if (isRegist) {
                return "Data already exist on Finished books"
            }

            return "No data"
        }

        return "No data"
    }
}

function findUser(data, user) {
    return data.find(d => d.title.toLowerCase() + d.author.toLowerCase() === user)
}

function saveData(data, key) {
    const isFilled = JSON.parse(localStorage.getItem(key));
    if (!isFilled) {
        localStorage.setItem(key, JSON.stringify([data]))
        return
    }

    localStorage.setItem(key, JSON.stringify([...isFilled, data]))
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setCardUi(data, type) {
    return `
    <div class="card">
        <h5>${data.title}</h5>
        <p>Written by : <span class="written">${data.author}</span></p>
        <p>Year : <span class="year">${data.year}</span></p>
        <div class="card-control">
            <button class="btn-mark" data-id="${data.id}">Mark as ${type}</button>
            <button class="btn-delete" data-id="${data.id}">Delete</button>
        </div>
    </div>
    `
}
