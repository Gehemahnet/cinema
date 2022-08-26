let movies = [
    {
        name: "Blade Runner 2049",
        poster: "./images/posters/br2049.jpg",
        sessions: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        rooms: ["blue", "green"]
    },
    {
        name: "Dune",
        poster: "./images/posters/dune.jpg",
        sessions: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        rooms: ["red", "green"]
    },
    {
        name: "Shot Caller",
        poster: "./images/posters/sc.jpg",
        sessions: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        rooms: ["blue", "red"]
    }
]
let seats = [
    {
        room: "blue",
        rows: 20,
        columns: 30
    },
    {
        room: "red",
        rows: 10,
        columns: 15
    },
    {
        room: "green",
        rows: 30,
        columns: 30
    }
]

function getRange() {
    const node = document.querySelector(".dates")
    const today = new Date(Date.now())
    const options = {month: "2-digit", day: "numeric"}

    let day = new Date(Date.now())
    day.setDate(day.getDate() - 8)

    for (let count = 15; count > 0; count--) {
        let element = document.createElement("button")
        element.classList.add("dates__item")
        if (count < 8) {
            element.classList.add("archive")
        }
        day.setDate(day.getDate() + 1)
        element.textContent = `${day.toLocaleDateString('ru-RU', options)}`
        if (element.textContent === `${today.toLocaleDateString('ru-RU', options)}`) {
            element.classList.add("today")
        }
        node.appendChild(element)
    }
}

function renderMovies() {
    const moviesNode = document.querySelector(".movies")
    movies.map(movie => {
        movie.rooms.map(room => {
            let movieDiv = document.createElement("div")
            let roomName = room
            switch (roomName) {
                case "green":
                    roomName = "зеленый"
                    break
                case "blue":
                    roomName = "синий"
                    break
                case "red":
                    roomName = "красный"
                    break
            }
            movieDiv.innerHTML = `
            <div class="movies__item">
                <img class="movies__item-poster" src=${movie.poster} alt="">
                <div class="movies__item-info">
                    <h1>${movie.name}</h1>
                    <h2>Зал ${roomName}</h2>
                    <button id=${room} class="movies__item-choose-seats">Выбрать места</button>
                    <h4 class="movies__item-check">Data</h4>
                    <button class="movies__item-order">Забронировать</button>
                </div>
             </div>`
            moviesNode.appendChild(movieDiv)
        })
    })
    const buttons = [...document.querySelectorAll(".movies__item-choose-seats")]
    buttons.map(element => {
        element.addEventListener('click', showSeats)
    })
}

function renderSeats() {
    seats.map(room => {
        const roomsNode = document.querySelector(".rooms")
        let roomNode = document.createElement("div")
        roomNode.innerHTML = "<div><h1 class='room-title'>Выберите места</h1><button class='room-close'></button></div>"
        roomNode.classList.add("room")
        roomNode.classList.add("hidden")
        roomNode.id = `${room.room}__room`
        roomsNode.appendChild(roomNode)
        Array.from(document.querySelectorAll(".room-close")).map(item => item.addEventListener('click', hideSeats))
        let roomDiv = document.createElement("div")
        roomDiv.classList.add("room-rows")
        roomNode.appendChild(roomDiv)

        let screen = document.createElement("div")
        screen.classList.add("room__screen")
        screen.textContent = "Экран"
        roomDiv.appendChild(screen)

        for (let rowCounter = 1; rowCounter <= room.rows; rowCounter++) {
            let rowDiv = document.createElement("div")
            rowDiv.classList.add("room-row")
            rowDiv.innerHTML = `<span>${rowCounter} ряд</span>`
            roomDiv.appendChild(rowDiv)

            for (let colCounter = 1; colCounter <= room.columns; colCounter++) {
                let seat = document.createElement("button")
                seat.textContent = `${colCounter}`
                rowDiv.appendChild(seat)
            }
        }
    })

}
function showSeats() {
    hideSeats()
    document.getElementById(`${event.target.id}__room`).classList.remove("hidden")
}
function hideSeats() {
    Array.from(document.querySelectorAll(".room")).map(item => item.classList.add("hidden"))
}
renderSeats()
getRange()
renderMovies()


