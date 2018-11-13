const menuElement = document.getElementById('menu-navigation');
const imagePath = "assets/images/weather/svg/";
const contentElement = document.getElementsByClassName('content')[0];
const degreeElement = document.getElementById('degree');
const imageElement = document.getElementById('image');
const descriptionElement = document.getElementById('description');
const dateElement = document.getElementById('date');
const todayElement = document.getElementById('today');
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu'];
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

loadMenuHTML();
getWeather();

contentElement.style.display = 'none';

async function loadMenuHTML() {
    await fetch('components/menu.html').then(response => response.text()).then(response => {
        menuElement.innerHTML = response;

        let currentMenu = document.getElementsByClassName('menu')[0].getElementsByTagName('a')[1];
        currentMenu.className = 'active';
    });
}

function getTranslatedDescription(code) {
    let translated = "Berawan";
    let image = "clouds-1";

    switch (parseInt(code)) {
        case 4:
        case 37:
        case 38:
        case 39:
        case 47:
            translated = "Mendung dan Petir";
            image = "storm";
            break;
        case 30:
            translated = "Berawan";
            image = "clouds-1";
            break;
    }

    return { text: translated, image: image };
}

function getTranslatedDay(day) {
    if (typeof day == 'number')
        return dayNames[day - 1];

    switch (day) {
        case 'Mon':
            return dayNames[0];
            break;
        case 'Tue':
            return dayNames[1];
            break;
        case 'Wed':
            return dayNames[2];
            break;
        case 'Thu':
            return dayNames[3];
            break;
        case 'Fri':
            return dayNames[4];
            break;
        case 'Sat':
            return dayNames[5];
            break;
        case 'Sun':
            return dayNames[6];
            break;
    }
}

function getTranslatedMonth(month) {
    return monthNames[month];
}

async function getWeather() {
    const endpoint = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22bandung%2C%20id%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    await fetch(endpoint)
        .then(response => response.json())
        .then(response => {
            let weather = response.query.results.channel.item;
            let tempCelcius = Math.floor((weather.condition.temp - 32) * 5 / 9);
            let forecast = weather.forecast.filter((forecast, index) => index > 0 && index < 7);
            let translatedDescription = getTranslatedDescription(weather.condition.code);
            let today = new Date();
            let todayName = getTranslatedDay(today.getDay());
            let todayDate = today.getDate();
            let todayMonth = getTranslatedMonth(today.getMonth());
            let todayYear = today.getFullYear();

            contentElement.style.display = 'grid';
            dateElement.innerHTML = 'Updated at ' + weather.pubDate;
            degreeElement.innerHTML = tempCelcius + '°C';
            imageElement.setAttribute('src', imagePath + translatedDescription.image + '.svg');
            descriptionElement.innerHTML = translatedDescription.text;
            todayElement.innerHTML = `${todayName},  ${todayDate}  ${todayMonth} ${todayYear}`;

            forecast.map((forecast, index) => {
                const dayElement = document.getElementsByClassName('day')[index];
                let tempCelcius = Math.floor((forecast.high - 32) * 5 / 9);
                let translatedDescription = getTranslatedDescription(forecast.code);
                let dayName = getTranslatedDay(forecast.day);

                dayElement.getElementsByTagName('span')[0].innerHTML = dayName;
                dayElement.getElementsByTagName('img')[0].setAttribute('src', imagePath + translatedDescription.image + '.svg')
                dayElement.getElementsByTagName('span')[1].innerHTML = tempCelcius + '°C';
            });
        })
        .catch(error => console.log(error));
}