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


document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        const parentElement = e.target.parentNode.parentNode.parentNode;
        console.log(parentElement);
        // const deleted = parentElement.id === "card-unfinished" ? deleteItem("data-unfinished", id) : console.log("finished")
        // if (!deleted) console.log("Gagal");
        // window.location.reload()
    }
})

function deleteItem(key, id) {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(data);
    const newData = data.filter(d => d.id !== id);
    console.log(newData);
    localStorage.setItem(key, JSON.stringify(newData));

}

formAdd.addEventListener("submit", function (e) {
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
    const dataUnfinished = JSON.parse(localStorage.getItem("data-unfinished"));
    const dataFinished = JSON.parse(localStorage.getItem("data-finished"));
    if (!dataUnfinished && !dataFinished) {
        return "No data"
    }

    if (dataUnfinished) {
        const isRegist = findUser(dataUnfinished, user)
        console.log(isRegist);
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
            <button class="btn-delete" data-id="${data.id}">Delete</button>
        </div>
    </div>
    `
}
