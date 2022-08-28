let movies = [
    {
        name: "Blade Runner 2049",
        poster: "./images/posters/br2049.jpg",
        sessions: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        rooms: ["blue"]
    },
    {
        name: "Dune",
        poster: "./images/posters/dune.jpg",
        sessions: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        rooms: ["red"]
    },
    {
        name: "Shot Caller",
        poster: "./images/posters/sc.jpg",
        sessions: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        rooms: ["green"]
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

function renderRange() {
    const node = document.querySelector(".dates")
    const today = new Date(Date.now())
    const options = {month: "2-digit", day: "numeric"}

    let day = new Date(Date.now())
    day.setDate(day.getDate() - 8)

    for (let count = 15; count > 0; count--) {
        let element = document.createElement("button")
        element.onclick = chooseDate
        element.classList.add("dates__item")
        if (count > 8) {
            element.classList.add("archive")
        }
        day.setDate(day.getDate() + 1)
        element.textContent = `${day.toLocaleDateString('ru-RU', options)}`
        if (element.textContent === `${today.toLocaleDateString('ru-RU', options)}`) {
            element.classList.add("today")
            element.classList.add("active")
        }
        node.appendChild(element)
    }
    checkDate()
}

function renderMovies() {
    const moviesNode = document.querySelector(".movies")
    movies.map(movie => {
        movie.rooms.map(room => {
            let movieDiv = document.createElement("div")
            movieDiv.classList.add("movies__item")
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
                <img class="movies__item-poster" src=${movie.poster} alt="">
                <div class="movies__item-info">
                    <h2 class="movies__item-name">${movie.name}</h2>
                    <h3 class="movies__item-room">Зал ${roomName}</h3>
                    <h4 class="movies__item-sessions">Время</h4>
                    <button id=${room} class="movies__item-choose-seats">Выбрать места</button>
                </div>`
            moviesNode.appendChild(movieDiv)
            let times = document.createElement("div")
            times.classList.add("movies__item-times")
            movieDiv.querySelector("h4").appendChild(times)
            movie.sessions.map(session => {
                let time = document.createElement("button")
                time.textContent = `${session}`
                time.onclick = setDate
                time.classList.add("movies__item-time")
                times.appendChild(time)
            })
        })
    })
    const buttons = [...document.querySelectorAll(".movies__item-choose-seats")]
    buttons.map(element => {
        element.disabled = true
        element.addEventListener('click', showSeats)
    })
}

function renderSeats() {
    seats.map(room => {
        const roomsNode = document.querySelector(".rooms")
        let roomNode = document.createElement("div")
        roomNode.innerHTML = `
            <h1 class='room-movie-name'></h1>
            <div class='room-header'>
            <h1 class='room-title'>Выберите места</h1>
            <button class='room-close'><img src='./images/icons/close.svg' alt=''></button>
            </div>`
        roomNode.classList.add("room")
        roomNode.classList.add("hidden")
        roomNode.id = `${room.room}__room`
        roomsNode.appendChild(roomNode)
        Array.from(document.querySelectorAll(".room-close")).map(item => item.addEventListener('click', hideSeats))
        let roomDiv = document.createElement("div")
        roomDiv.classList.add("room-rows")
        roomNode.appendChild(roomDiv)

        let screen = document.createElement("h3")
        screen.classList.add("room-screen")
        screen.textContent = "Экран"
        roomDiv.appendChild(screen)

        for (let rowCounter = 1; rowCounter <= room.rows; rowCounter++) {
            let rowDiv = document.createElement("div")
            rowDiv.classList.add("room-row")
            rowDiv.innerHTML = `<span class="room-row-number">${rowCounter} ряд</span>`
            let seats = document.createElement("div")
            seats.classList.add("room-seats")
            rowDiv.appendChild(seats)
            roomDiv.appendChild(rowDiv)

            for (let colCounter = 1; colCounter <= room.columns; colCounter++) {
                let seat = document.createElement("button")
                seat.classList.add("room-seat")
                seat.textContent = `${colCounter}`
                seat.onclick = setSeat
                seats.appendChild(seat)
            }
            let rowNumber = document.createElement("span")
            rowNumber.classList.add("room-row-number")
            rowNumber.textContent = `ряд ${rowCounter}`
            rowDiv.appendChild(rowNumber)

        }
        let colors = document.createElement("div")
        colors.classList.add("room-colors")
        colors.innerHTML = "" +
            "<span class='room-color reserved'>Занято</span>" +
            "<span class='room-color'>Свободно</span>"
        let submitButton = document.createElement("button")
        submitButton.classList.add("room-submit")
        submitButton.onclick = (e) => submitOrder(e)
        submitButton.textContent = "Забронировать"
        roomNode.appendChild(colors)
        roomNode.appendChild(submitButton)
    })
    Array.from(document.querySelectorAll(".room")).map(room => room.addEventListener('click', e => e.stopPropagation()))
}

function checkReservation(e) {
    let storage = JSON.parse(localStorage.getItem("cinema"))
    let movie = e.target.parentNode.querySelector(".movies__item-name").textContent
    let date = document.querySelector('.movies__title').textContent.split(' ').slice(-1).join('')
    let time = document.querySelector('.movies__item-time.chosen').textContent
    let seats = []
    storage.map(ticket => {
        seats = [...seats, ...ticket.seats]
        Array.from(document.querySelectorAll(".room")).map(room => {
            if (!room.classList.contains("hidden")) {
                let currentRoom = room
                if (ticket.movie === movie) {
                    if(ticket.date === date) {
                        if(ticket.time === time) {
                            //После провеки билета на соответствие залу, фильму, времени и дате начинаем помечать купленные места
                            seats.map(seat => {
                                let seatRow = seat.split(' ')[0]
                                let seatNumber = seat.split(' ')[1]
                                Array.from(currentRoom.querySelectorAll(".room-row")).map(row => {
                                    let rowNumber = row.querySelector(".room-row-number").textContent.slice().split(' ')[0]
                                    if (rowNumber === seatRow) {
                                        Array.from(row.querySelectorAll(".room-seat")).map(place => {
                                            if(place.textContent === seatNumber) {
                                                place.classList.add("reserved")
                                            }
                                        })
                                    }
                                })
                            })
                        }

                    }
                }
            }
        })
    })
    Array.from(document.querySelectorAll(".room-seat")).map(seat => {
        if (seat.classList.contains("reserved")) {
            seat.disabled = true
        }
    })
}


function checkFilm(e) {
    let currentFilm = e.target.closest("div").querySelector(".movies__item-name").textContent
    Array.from(document.querySelectorAll(".room")).map((room => {
        !room.classList.contains("hidden") && (room.querySelector(".room-movie-name").textContent = currentFilm)
    }))
}

function checkDate() {
    let currentDate = document.querySelector(".dates__item.active").textContent
    document.querySelector(".movies__title").textContent = `Выберите сеанс на ${currentDate}`
}

function chooseDate(e) {
    Array.from(document.querySelectorAll(".dates__item")).map(date => date.classList.remove("active"))
    e.target.classList.add("active")
    checkDate()
}


function setDate(e) {
    Array.from(document.querySelectorAll(".movies__item-choose-seats")).map(button => button.disabled = true)
    Array.from(document.querySelectorAll(".movies__item-time")).map(date => date.classList.remove("chosen"))
    e.target.classList.add("chosen")
    e.target.parentNode.parentNode.parentNode.querySelector(".movies__item-choose-seats").disabled = false
}

//Каждая запись в локальное хранилище при бронировании будет являться билетом и добавляться в массив этих билетов с данными о сеансе
function showSeats(e) {
    hideSeats()
    document.querySelector(".rooms").classList.remove("hidden")
    document.getElementById(`${e.target.id}__room`).classList.remove("hidden")
    document.body.classList.add("popup")
    checkFilm(e)
    localStorage.hasOwnProperty("cinema") && checkReservation(e)
}

function hideSeats() {
    document.querySelector(".rooms").classList.add("hidden")
    Array.from(document.querySelectorAll(".room")).map(item => item.classList.add("hidden"))
    Array.from(document.querySelectorAll(".room-seat.chosen")).map(item => item.classList.remove("chosen"))
    Array.from(document.querySelectorAll(".room-seat.reserved")).map(item => item.classList.remove("reserved"))
    document.body.classList.remove("popup")
}

function setSeat(e) {
    e.target.classList.toggle("chosen")
}

function submitOrder(e) {
    e.preventDefault()
    let movie = e.target.closest("div").querySelector(".room-movie-name").textContent
    let date = document.querySelector('.movies__title').textContent.split(' ').slice(-1).join('')
    let time = document.querySelector('.movies__item-time.chosen').textContent
    let reservedSeats = Array.from(e.target.closest("div").querySelectorAll(".chosen"))
    let data = [
        {
            movie: movie,
            date: date,
            time: time,
            seats: []
        }
    ]
    reservedSeats.map(seat => {
        let seatRow = seat.parentNode.parentNode.querySelector(".room-row-number").textContent.slice().split(' ')[0]
        let seatNumber = seat.textContent
        data[0].seats.push(`${seatRow} ${seatNumber}`)
    })
    console.log(data)
    if (localStorage.hasOwnProperty("cinema")) {
        let storage = JSON.parse(localStorage.getItem(`cinema`))
        storage = [...storage, ...data]
        console.log(storage)
        localStorage.setItem("cinema", JSON.stringify(storage))
    } else {
        localStorage.setItem("cinema", JSON.stringify(data))
    }

}


renderRange()
renderMovies()
renderSeats()




