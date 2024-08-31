let bodyy = document.querySelector('body');                            //GLOBAL VARIABLES
let backButton = document.querySelector("#back-button-div");
let searchInput = document.querySelector("#search-input");
let searchButton = document.querySelector("#search-icon-div");
let favouritesButtonInTheHeader = document.querySelector("#favourites-button-div");
let suggestionsDiv = document.querySelector("#suggestions-div");
let mainContentDiv = document.querySelector("#main-content");
let mainEl = document.querySelector('main');
let searchResult;
let favourites = [];
let lastSearched;
let visitRepository = document.querySelector("#visit-repository-div .header-text");

let savedArrayString;
let favouritesMoviesJSON;

let loadingElement = document.createElement('div');   // creates the loading element whose display is either set to flex or none depending on the state

function addFavouriteMovieToTheListOnScreen(movie){                     //FETCHES THE MOVIES' DATA IN THE FAVOURITES LIST
    let imdbID = movie.imdbID;
    let name = movie.Title;
    let year = movie.Year;
    let type = movie.Type.toUpperCase();
    let posterUrl = movie.Poster;
let movieDiv = document.createElement("div");
movieDiv.className = 'movie-result-list-item';
let movieImageDiv = document.createElement("div");
movieImageDiv.className = 'movie-result-list-item-image';
let movieImage = document.createElement("img");
movieImage.src = `${posterUrl}`;
movieImageDiv.appendChild(movieImage);
movieDiv.appendChild(movieImageDiv);          //
let movieInfoDiv = document.createElement('div');
movieInfoDiv.className = 'movie-result-list-item-info';
let movieName = document.createElement('span');
movieName.className = 'movie-result-list-title';
movieName.innerText = name;
movieInfoDiv.appendChild(movieName);
let movieYear = document.createElement('span');
movieYear.className = 'movie-result-list-year';
movieYear.innerText = year;
movieInfoDiv.appendChild(movieYear);
let movieType = document.createElement('span');
movieType.className = 'movie-result-list-year';
movieType.innerText = type;
movieInfoDiv.appendChild(movieType);
movieDiv.appendChild(movieInfoDiv);             //
let addToListButtonDiv = document.createElement("div");
addToListButtonDiv.className = 'add-to-list-button-div';
let addToListButton = document.createElement("div");
addToListButton.className = 'add-to-list-button';
let addButtonIcon = document.createElement("i");
addButtonIcon.className = 'fa-solid fa-bookmark add-to-favourites-icon-for-a-movie';
let bookmarkButtonPressed = false;
addToListButton.appendChild(addButtonIcon);
addToListButtonDiv.appendChild(addToListButton);
movieDiv.appendChild(addToListButtonDiv);   //
mainContentDiv.appendChild(movieDiv);
movieDiv.addEventListener('click',function(event){
    if(event.target == addToListButton || event.target == addButtonIcon){
    } else {
        backButton.style.display = 'none';
        addLoadingElement();
        loadMovie(imdbID);
    }
});
addToListButton.addEventListener('click', function(){
    let idOfTheMovieOnWhichTheButtonIsPresent = imdbID;
    let parentElement = this.parentElement.parentElement;
    parentElement.style.opacity = '0';
    setTimeout(function(){
        let indexOfIdToBeDeleted = favourites.indexOf(idOfTheMovieOnWhichTheButtonIsPresent);

        favourites.splice(indexOfIdToBeDeleted, 1);
        favouritesMoviesJSON = JSON.stringify(favourites);
        localStorage.setItem('favouriteMovies',favouritesMoviesJSON);
        
        parentElement.remove();
        if(favourites.length === 0){
            let emptySpanHtml = `<span id="list-empty">Empty...</span>`;
            mainContentDiv.insertAdjacentHTML('beforeend', emptySpanHtml);
        }
    },510);
});
}
function addLoadingElement() {                                          // DISPLAYS LOADING ON THE SCREEN
    loadingElement.style.display = 'flex';
    console.log('loading');
}
function removeLoadingElement() {                                       // REMOVES THE LOADING TEXT ON SCREEN
    loadingElement.style.display = 'none';
    console.log('loaded');
}
async function displayFavourites(){                               //DISPLAYS THE FAVOURITES' LIST
    let requests = favourites.map(async function(id){
        let request = await fetch(`https://www.omdbapi.com/?&apikey=1f627bef&i=${id}`);
        let movieObject = await request.json();
        return movieObject;       // returns a promise that resolves into the movie object
    });
    Promise.all(requests).then(function(movieObjectArray){
        removeLoadingElement();
        let numberOfMovies = movieObjectArray.length;
        if(numberOfMovies == 0){
            let emptySpanHtml = `<span id="list-empty">Empty...</span>`;
            mainContentDiv.insertAdjacentHTML('beforeend', emptySpanHtml);
            mainContentDiv.style.opacity = '1';
            backButton.style.opacity = '1';
        } else {
        let currentMovie = 0;
            movieObjectArray.forEach(function(movieObject){
                currentMovie++;
                addFavouriteMovieToTheListOnScreen(movieObject);
                if(currentMovie == numberOfMovies){
                    mainContentDiv.style.opacity = '1';
                    backButton.style.opacity = '1';
                }
            });
        }
    });     
}   
function displayMovie(movieObject){                              //THIS ADDS THE DATA TO THE MOVIE'S INFO SCREEN
    
    bodyy.style.overflow = 'hidden';
    let imdbID = movieObject.imdbID;
    let isIdFavourite = favourites.indexOf(imdbID);
    setTimeout(function(){
        mainContentDiv.innerHTML = '';
        removeLoadingElement();
        let movieExpandedDiv = document.createElement('div');
        movieExpandedDiv.id = 'movie-expanded-div';
        mainContentDiv.appendChild(movieExpandedDiv);
        let favouriteButtonDivHuge = document.createElement('div');
        favouriteButtonDivHuge.id = 'favourite-button';
        let favouriteButtonIconHuge = document.createElement('i');
        favouriteButtonIconHuge.className = 'fa-regular fa-bookmark';
        if(isIdFavourite === -1){
            favouriteButtonIconHuge.className = 'fa-regular fa-bookmark';
        } else {
            favouriteButtonIconHuge.className = 'fa-solid fa-bookmark';
        }
        favouriteButtonIconHuge.id = 'favourite-button-huge';
        favouriteButtonDivHuge.appendChild(favouriteButtonIconHuge);
        movieExpandedDiv.appendChild(favouriteButtonDivHuge);
        mainContentDiv.appendChild(movieExpandedDiv);
        favouriteButtonIconHuge.addEventListener('click',function(){
            if(isIdFavourite === -1){
                favouriteButtonIconHuge.className = 'fa-solid fa-bookmark';

                favourites.push(imdbID);
                console.log(favourites);
                isIdFavourite = 1;
                favouritesMoviesJSON = JSON.stringify(favourites);
                localStorage.setItem('favouriteMovies',favouritesMoviesJSON);
            } else if(isIdFavourite != -1) {
                favouriteButtonIconHuge.className = 'fa-regular fa-bookmark';
                let indexToBeRemoved = favourites.indexOf(imdbID);
                console.log('index to be removed', indexToBeRemoved);
                favourites.splice(indexToBeRemoved, 1);
                console.log('favourites',favourites);
                isIdFavourite = -1;
                favouritesMoviesJSON = JSON.stringify(favourites);
                localStorage.setItem('favouriteMovies',favouritesMoviesJSON);
            }
        });
        let actualMovieInfo = document.createElement("div");
        actualMovieInfo.id = 'actual-movie-info';
        movieExpandedDiv.appendChild(actualMovieInfo);
        let posterMovieExpandedDiv = document.createElement('div');
        posterMovieExpandedDiv.id = 'poster-movie-expanded-div';
        actualMovieInfo.appendChild(posterMovieExpandedDiv);
        let posterMovieExpanded = document.createElement('img');
        posterMovieExpanded.id = 'poster-movie-expanded';
        posterMovieExpanded.src = movieObject.Poster;
        posterMovieExpandedDiv.appendChild(posterMovieExpanded);
        actualMovieInfo.appendChild(posterMovieExpandedDiv);

        let infoMovieExpandedDiv = document.createElement('div');
        infoMovieExpandedDiv.id = 'info-movie-expanded-div';
        actualMovieInfo.appendChild(infoMovieExpandedDiv);
        let titleYearRatedRuntimeHtml = `<div id="title">${movieObject.Title}</div>
        <div id="info-gray">${movieObject.Year} | ${movieObject.Rated} | ${movieObject.Runtime}</div>`;
        infoMovieExpandedDiv.insertAdjacentHTML('beforeend', titleYearRatedRuntimeHtml);      
        let genreDiv = document.createElement("div");
        genreDiv.id = 'genres';
        infoMovieExpandedDiv.appendChild(genreDiv);
        let genreString = movieObject.Genre;
        let arrayOfGenres = genreString.split(',');
        for(let genre of arrayOfGenres){
            let genreHtml = `<div class='genre'>${genre.trim()}</div>`;
            genreDiv.insertAdjacentHTML('beforeend',genreHtml);
        }
        let html2=`
                <div id="plot">${movieObject.Plot}</div>
                <div class="white-line"></div>
                <div class="category"><span class='category-name'>Director(s):</span><span class='category-value'>${movieObject.Director}</span></div>
                <div class="white-line"></div>
                <div class="category"><span class='category-name'>Writer(s):</span><span class='category-value'>${movieObject.Writer}</span></div>
                <div class="white-line"></div>
                <div class="category"><span class='category-name'>Stars:</span><span class='category-value'>${movieObject.Actors}</span></div>

                <div id="info-bottom">
                    <div id="imdb-votes-div"><span id='imdb-votes'>IMDb Votes</span><span id='imdb-votes-value'>${movieObject.imdbVotes}</span></div>
                    <div id="box-office-div"><span id='box-office'>Box Office</span><span id='box-office-value'>${movieObject.BoxOffice}</span></div>
                </div>`;
        infoMovieExpandedDiv.insertAdjacentHTML('beforeend', html2);
        let awards = document.createElement('div');
        awards.id = 'awards';
        awards.textContent = `${movieObject.Awards}`;
        movieExpandedDiv.appendChild(awards);
        let ratingsDiv = document.createElement('div');
        ratingsDiv.id = 'ratings';
        actualMovieInfo.appendChild(ratingsDiv);
        let ratingsArray = movieObject.Ratings;
        for(let rating of ratingsArray){
            let ratingHtml = `<div class='rating'><span class='rating-company'>${rating.Source}</span><span class='rating-value'>${rating.Value}</span></div>`;
            ratingsDiv.insertAdjacentHTML('beforeend', ratingHtml);
        }
        mainContentDiv.style.opacity = '1';
        setTimeout(function(){
            backButton.style.display = 'flex';
            backButton.style.opacity = '1';
            backButton.style.zIndex = '1';
            backButton.style.left = '6vw';
            backButton.style.top = '60px';
        },500);
        setTimeout(function(){
            movieExpandedDiv.style.transform = 'scale(1)';
        });
    },510);
}
function loadMovie(imdbID){                                             //THIS FUNCTION FETCHES DETAILED DATA OF THE CLICKED MOVIE AND CALLS THE MOVIE'S INFO SCREEN FUNCTION
    mainContentDiv.style.opacity = '0';
    addLoadingElement();
    let url = `https://omdbapi.com/?&apikey=1f627bef&i=${imdbID}`;
    let request = fetch(url);
    request.then(function(response){
        return response.json();
    }).then(function(movieObject){
        displayMovie(movieObject);
    });
}
function addEventListenerToFavouritesButton(){                             //FAVOURITE BUTTON CAN ADD OR DELETE THE MOVIE'S ID TO THE FAVOURITES ARRAY
    favouritesButtonInTheHeader.addEventListener("click", function(){
        mainContentDiv.style.opacity = '0';
        backButton.style.display = 'flex';
        setTimeout(function(){
            addLoadingElement();
            mainContentDiv.textContent = '';
            let favouritesName = `<span class="favourites-header">Favourites!</span>`;
            mainContentDiv.insertAdjacentHTML('beforeend',favouritesName);
            displayFavourites();
        },550);
    });
}
function addEventListenerToBackButton(){                                   //BACK BUTTON RETURNS THE USER FROM THE FAVOURITES SCREEN OR MOVIE'S SCREEN TO THE SEARCH RESULTS' SCREEN
    backButton.addEventListener('click', function(){
        bodyy.style.overflow = 'auto';
        backButton.style.opacity = '0';
        mainContentDiv.style.opacity = '0'
        setTimeout(function(){
            addLoadingElement();
            backButton.style.display = 'none';
            mainContentDiv.textContent = '';
            mainContentDiv.style.opacity = '1';
            fetchInfo(lastSearched,'forPage');
        },510);
    });
}
function addMovieToTheListOnSuggestions(movie){                              //THIS FUNCTION ADDS THE SUGGESTIONS TO THE SUGGESTIONS DIV
    let name = movie.Title;
    let suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'suggestion-div';
    let spanName = document.createElement('span');
    spanName.className = 'suggestion';
    spanName.textContent = name;
    suggestionDiv.appendChild(spanName);
    let suggestionLine = document.createElement('div');
    suggestionLine.className = 'line';
    suggestionDiv.insertAdjacentElement('afterend',suggestionLine);
    suggestionDiv.addEventListener('click', function(event){
        suggestionsDiv.textContent = '';
        suggestionsDiv.style.display = 'none';
        mainContentDiv.textContent = '';
        addLoadingElement();
        fetchInfo(name, 'forPage');
        backButton.style.display = 'none';
        searchInput.value = name;
        lastSearched = name;
    });
    suggestionsDiv.appendChild(suggestionDiv);
}
function addMovieToTheListOnScreen(movie){                                //THIS FUNCTION ADDS THE SEARCH RESULTS ON THE SCREEN
    let imdbID = movie.imdbID;
    let name = movie.Title;
    let year = movie.Year;
    let type = movie.Type.toUpperCase();
    let posterUrl = movie.Poster;
let movieDiv = document.createElement("div");
movieDiv.className = 'movie-result-list-item';
let movieImageDiv = document.createElement("div");
movieImageDiv.className = 'movie-result-list-item-image';
let movieImage = document.createElement("img");
movieImage.src = `${posterUrl}`;
movieImageDiv.appendChild(movieImage);
movieDiv.appendChild(movieImageDiv);          //
let movieInfoDiv = document.createElement('div');
movieInfoDiv.className = 'movie-result-list-item-info';
let movieName = document.createElement('span');
movieName.className = 'movie-result-list-title';
movieName.innerText = name;
movieInfoDiv.appendChild(movieName);
let movieYear = document.createElement('span');
movieYear.className = 'movie-result-list-year';
movieYear.innerText = year;
movieInfoDiv.appendChild(movieYear);
let movieType = document.createElement('span');
movieType.className = 'movie-result-list-year';
movieType.innerText = type;
movieInfoDiv.appendChild(movieType);
movieDiv.appendChild(movieInfoDiv);             //
let addToListButtonDiv = document.createElement("div");
addToListButtonDiv.className = 'add-to-list-button-div';
let addToListButton = document.createElement("div");
addToListButton.className = 'add-to-list-button';
let addButtonIcon = document.createElement("i");
let isMovieAlreadyMarkedAsFavourite = favourites.indexOf(imdbID);
let bookmarkButtonPressed;
if(isMovieAlreadyMarkedAsFavourite == -1){
    addButtonIcon.className = 'fa-regular fa-bookmark add-to-favourites-icon-for-a-movie';
    bookmarkButtonPressed = false;
} else {
    addButtonIcon.className = 'fa-solid fa-bookmark add-to-favourites-icon-for-a-movie';
    bookmarkButtonPressed = true;
}
addToListButton.appendChild(addButtonIcon);
addToListButtonDiv.appendChild(addToListButton);
movieDiv.appendChild(addToListButtonDiv);   //
mainContentDiv.appendChild(movieDiv);

movieDiv.addEventListener('click',function(event){
    if(event.target == addToListButton || event.target == addButtonIcon){

    } else {
        loadMovie(imdbID);
    }
});

addToListButton.addEventListener('click', function(){
    if(!favourites.includes(imdbID)){

        favourites.push(imdbID);
        favouritesMoviesJSON = JSON.stringify(favourites);
        localStorage.setItem('favouriteMovies',favouritesMoviesJSON);
    } else {
        let indexOfID = favourites.indexOf(imdbID);

        favourites.splice(indexOfID, 1);
        favouritesMoviesJSON = JSON.stringify(favourites);
        localStorage.setItem('favouriteMovies',favouritesMoviesJSON);
    }
    if(bookmarkButtonPressed == false){
        addButtonIcon.className = "fa-solid fa-bookmark add-to-favourites-icon-for-a-movie";
        bookmarkButtonPressed = true;
    } else if(bookmarkButtonPressed == true){
        addButtonIcon.className = 'fa-regular fa-bookmark add-to-favourites-icon-for-a-movie';
        bookmarkButtonPressed = false;
    };
});
}
function displayResult(object, whoCalled) {                                         //AFTER THE RESULTS FOR A SEARCH ARE FETCHED, THE FUNCTION TO ARRANGE THE DATA IS CALLED
                                                                                    //THIS FUNCTION ADDS DATA TO EITHER THE SUGGESTIONS BOX OR ON THE PAGE DEPENDING ON THE FUNCTION THAT CALLED THIS FUNCTION
    let resultArray = object.Search;
    if(whoCalled === 'forPage'){
        removeLoadingElement();
        for(let movie of resultArray) {
            addMovieToTheListOnScreen(movie);
        }
    } else if(whoCalled === 'forSuggestions'){
        for(let movie of resultArray) {
            addMovieToTheListOnSuggestions(movie);
        }
    }
}
function fetchInfo(name, whoCalled){                                                 //FETCHES THE SEARCHED NAME'S DATA FROM THE API
    let url = `https://www.omdbapi.com/?&apikey=1f627bef&s=${name.toString()}`;
    let request = fetch(url);
    request.then((response)=>{
        return response.json();
    }).then(function(object){
        searchResult =  object;
        if(whoCalled === 'forPage'){
            
            mainContentDiv.innerText = '';
            let html = `<div class="favourites-header">Search Results For '${name}'</div>`;
            mainContentDiv.insertAdjacentHTML('beforeend', html);
        }
        displayResult(object,whoCalled);
    });
}
function addEventListenerToSearchButton(){                               //SEARCHES FOR THE TYPED MOVIE NAME
    searchButton.addEventListener('click',function(){
        backButton.style.display = 'none';
        let input = searchInput.value;
        lastSearched = input;
        //suggestionsDiv.innerText = '';
        mainContentDiv.innerText = '';
        let loadingHTML = `<span class="main-screen-text">Loading...</span>`
        mainContentDiv.innerHTML = loadingHTML;
        fetchInfo(input, 'forPage');
    });
}
function addEventListenerToSearchBar(){                                               //EVENT LISTENER TO UPDATE THE SUGGESITONS WHILE TYPING
    searchInput.addEventListener('input', function(){
        suggestionsDiv.style.display = 'block';
        suggestionsDiv.textContent = '';
        let textEntered = searchInput.value;
        fetchInfo(textEntered, 'forSuggestions');
    });
}
function addEventListenerToBodyForHidingSuggestionsOnClick(){                           //SUUGESTIONS HIDE WHEN THE USER CLICKS ON ANYTHING OTHER THAN THE SUGGESTIONS
    bodyy.style.height = 'calc(100vh - 4.5rem)';
    bodyy.addEventListener('click', function(event){
        if(event.target === suggestionsDiv || event.target.className === 'suggestion-div' || event.target.className === 'suggestion'){
        } else {
            suggestionsDiv.textContent = '';
            suggestionsDiv.style.display = 'none';
        }
    });
}
function addEventListenerToVisitRepository(){                                           //ADDS LINK TO 'VISIT REPOSITORY' BUTTON
    visitRepository.addEventListener('click', function(){
        window.open('https://github.com/rushab-rayalwar/IMDbClone');    
    })
}
function main() {                                                                      //MAIN FUNCTION
    savedArrayString = localStorage.getItem('favouriteMovies');
    if(savedArrayString){
        favourites = JSON.parse(savedArrayString);
    } else {
        favouritesMoviesJSON = JSON.stringify(favourites);
        localStorage.setItem('favouriteMovies',favouritesMoviesJSON);
    }
    addEventListenerToSearchButton();
    addEventListenerToSearchBar();
    addEventListenerToFavouritesButton();
    addEventListenerToBackButton();
    addEventListenerToBodyForHidingSuggestionsOnClick();
    addEventListenerToVisitRepository();

    loadingElement.className = 'main';
    loadingElement.id = 'loading';
    loadingElement.style.display = 'none'
    loadingElement.innerHTML = `<span class="main-screen-text">Loading...</span>`;
    mainEl.appendChild(loadingElement);
}
main();