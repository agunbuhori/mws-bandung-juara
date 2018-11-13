const menuElement = document.getElementById('menu-navigation');
const contentElement = document.getElementsByClassName('content')[0];
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu'];
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

loadMenuHTML();
loadNews();

async function loadMenuHTML() {
    await fetch('components/menu.html').then(response => response.text()).then(response => {
        menuElement.innerHTML = response;

        let currentMenu = document.getElementsByClassName('menu')[0].getElementsByTagName('a')[2];
        currentMenu.className = 'active';
    });
}

function formatDate(date) {
    date = new Date(date);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

async function loadNews() {
    const endpoint = "https://newsapi.org/v2/top-headlines?country=id&category=technology&apiKey=d504899042dd4b45a16e22bb33be3353";

    await fetch(endpoint).then(response => response.json()).then(response => {
        let articles = response.articles;
        let articleItem = "";

        articles.forEach(article => {
            articleItem += `
                        <div class="article">
                            <a class="article-img" href="${article.url}">
                                <img src="${article.urlToImage ? article.urlToImage : 'assets/images/bandung.png'}">
                            </a>
                            <div class="article-content">
                                <div class="description">
                                    <span><i class="icon ion-md-calendar"></i> ${formatDate(article.publishedAt)}</span>
                                    <span><i class="icon ion-md-globe"></i> ${article.source.name}</span>
                                </div>
                                <a href="${article.url}"><span>${article.title.substr(0, 50)}</span></a>
                            </div>
                        </div>
                    `;
        })

        contentElement.innerHTML = articleItem;
    });
}