const API_KEY = "b162de2822da4534936132009242104";
const target = "Chennai";
const baseUrl = "https://api.weatherapi.com/v1";

const tempElem = document.querySelector(".temp")
const locationElem = document.querySelector(".time_location > p")
const dateTimeElem = document.querySelector(".time_location > span")
const weatherIcon = document.querySelector(".weather_condition > p > img")
const conditionElem = document.querySelector(".weather_condition > span")
const celOrFarContainer = document.querySelector(".cel-or-far")
const celBtn = celOrFarContainer.querySelector(".cel")

let celOrFar = "cel"

celOrFarContainer.addEventListener("click", () => {
    if (celBtn.innerText === "Celsius") {
        celOrFar = "far"
        celBtn.innerText = "Farenheit"
    } else if (celBtn.innerText === "Farenheit") {
        celOrFar = "cel"
        celBtn.innerText = "Celsius"
    }
})
function getDayFullName(num) {
    switch (num) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        default: "Invalid Day"
    }
}

function getMonth(num) {
    switch (num) {
        case "01": return "January";
        case "02": return "February";
        case "03": return "March";
        case "04": return "April";
        case "05": return "May"
    }
}

function formatDateTime(dateObject) {
    const exactTime = dateObject.split(" ")[1]; // 23:11
    const exactDate = dateObject.split(" ")[0]; // 2024-03-22
    const formattedExactDate = exactDate.split("-")
    const formattedExactDateString = `${formattedExactDate[2]} ${getMonth(formattedExactDate[1])} ${formattedExactDate[0]}`
    const exactDay = new Date(exactDate).getDay(); // 0-6
    const formatDate = `${exactTime}\n${getDayFullName(exactDay)}, ${formattedExactDateString}`;
    return formatDate
}

async function fetchData(target) {
    try {
        const url = `${baseUrl}/current.json?key=${API_KEY}&q=${target}&aqi=yes`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {
            if (data.error) {
                throw new Error(data)
            }
            if (celOrFar === "cel") {
                tempElem.innerText = `${data.current.temp_c} °C`
            } else if (celOrFar === "far") {
                tempElem.innerText = `${data.current.temp_f} °F`
            }
            locationElem.innerText = data.location.name
            dateTimeElem.innerText = formatDateTime(data.location.localtime)
            weatherIcon.src = data.current.condition.icon
            conditionElem.innerText = data.current.condition.text
        } else if (response.status === 400) {
            alert("Please enter valid city name!")
        }
    } catch (err) {
        console.log(err)
    }
}

const formElem = document.querySelector("form")
formElem.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputTextElem = formElem.querySelector("input");
    let location = inputTextElem.value;
    fetchData(location)
})


// async function gettz(){
//     const tz_url = `${baseUrl}/timezone.json?key=${API_KEY}&q=Asia/Kolkata`
//     const tzResponse = await fetch(tz_url)
//     const tzdata = await tzResponse.json()
//     console.log(tzdata)
// }
// gettz()