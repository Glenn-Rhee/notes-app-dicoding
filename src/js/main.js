const formAdd = document.querySelector("#form-add");
const inputs = document.querySelectorAll(".add-book .input-group input")
const cardUnfinished = document.querySelector("#card-unfinished");
const containerUnfinished = document.querySelector("#section-unfinished")
const cardFinished = document.querySelector("#card-finished")
const containerFinished = document.querySelector("#section-finished");
const btnDelete = document.querySelector("#btn-delete");
const nullDataUnfinished = document.querySelector("#no-data-unfinished");
const nullDataFinished = document.querySelector("#no-data-finished");
const errorInput = document.querySelector(".error-input");

(() => {
    let cards = '';
    let data = getData("data-unfinished");
    if (data) {
        nullDataUnfinished.classList.remove("show")
        data.forEach(d => cards += setCardUi(d));
        cardUnfinished.innerHTML = cards
    } else {
        nullDataUnfinished.classList.add("show")
    }

    cards = '';
    data = getData("data-finished");
    if (data) {
        nullDataFinished.classList.remove("show-finished")
        data.forEach(d => cards += setCardUi(d));
        cardFinished.innerHTML = cards
    } else {
        nullDataFinished.classList.add("show-finished")
    }
})()

formAdd.addEventListener("submit", function (e) {
    e.preventDefault();

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
    window.location.reload();
    setTimeout(() => {
        if (!data.isComplete) {
            const offsetYCard = containerUnfinished.offsetTop;
            scrollingElement(offsetYCard)
        } else {
            const offsetYCard = containerFinished.offsetTop;
            scrollingElement(offsetYCard)
        }
    }, 200);
})

function isRegistered(title, author) {
    const user = title.toLowerCase() + author.toLowerCase();
    let data = JSON.parse(localStorage.getItem("data-unfinished"));
    let isRegist = data.find(d => d.title.toLowerCase() + d.author.toLowerCase() === user);
    if (!isRegist) {
        data = JSON.parse(localStorage.getItem("data-finished"));
        isRegist = data.find(d => d.title.toLowerCase() + d.author.toLowerCase() === user)
        if (isRegist) {
            return "Already fill on Finished Books"
        }
        return "No data"
    }

    return "Alredy fill on Unfinished books"
}

function scrollingElement(offsetTop) {
    window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
    })
}

function saveData(data, key) {
    console.log(data, key);
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

function setCardUi(data) {
    return `
    <div class="card">
        <h5>${data.title}</h5>
        <p>Written by : <span class="written">${data.author}</span></p>
        <p>Year : <span class="year">${data.year}</span></p>
        <div class="card-control">
            <button>Mark as read</button>
            <button class="btn-delete" data-id="${data.id}/">Delete</button>
        </div>
    </div>
    `
}
