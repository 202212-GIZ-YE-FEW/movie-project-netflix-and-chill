"use strict";

const API_KEY = "542003918769df50083a13c415bbc602";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";

const CONTAINER = document.createElement("div");
CONTAINER.classList.add("container", "mb-32");
const selectedGenras = [];
const mainContainer = document.querySelector(".mainContainer");
mainContainer.appendChild(CONTAINER);
const date = new Date();
const currentDate =
  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
const release = `&primary_release_date.gte=1992-01-01&primary_release_date.lte=${currentDate}`; //Todo: Fix
const youtubeBaseUrl = `https://www.youtube.com/embed/`;

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 60;

const deletingContainerContent = () => {
  while (CONTAINER.firstChild) {
    CONTAINER.firstChild.remove();
  }
};
// Don't touch this function please
const autorun = async (path, query = "") => {
  lastUrl = path;
  const movies = await fetchMovies(path, query);
  currentPage = movies.page;
  nextPage = currentPage + 1;
  prevPage = currentPage - 1;
  totalPages = movies.total_pages;

  current.innerText = currentPage;

  if (currentPage <= 1) {
    prev.classList.add("disabled");
    next.classList.remove("disabled");
  } else if (currentPage >= totalPages) {
    prev.classList.remove("disabled");
    next.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
    next.classList.remove("disabled");
  }

  window.scrollTo(0, 0);

  genresDetails();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${API_KEY}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const credits = await fetchCredits(movie.id); //added new to get actors & director
  const similarMovies = await fetchSimilarMovies(movie.id); //added new to get similar movies
  renderMovie(movieRes, credits, similarMovies);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async (path, query = "") => {
  const url = constructUrl(path) + query;
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

//This is for fetching Credits (created new)
// Don't touch this function please. This function is to fetch credits for one movie.
const fetchCredits = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

//This is for fetching Similar Movies (created new)
// Don't touch this function please. This function is to fetch similar movies for one movie.
const fetchSimilarMovies = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  deletingContainerContent();
  const newDiv = document.createElement("div");
  newDiv.classList.add(
    "grid",
    "grid-cols-1",
    "gap-6",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "lg:px-20"
  );
  movies.forEach((movie) => {
    genresDetailsItem(movie.genre_ids, movie.id);
    const movieDiv = document.createElement("div");
    movieDiv.id = "movieCard";
    movieDiv.classList.add(
      "w-80",
      "rounded-lg",
      "shadow-md",
      "shadow-gray-300",
      "hover:shadow-lg",
      "overflow-hidden",
      "duration-3000",
      "transition",
      "relative"
    );
    movieDiv.innerHTML = `
    <div class="relative overflow-hidden">
    <div id="overview" class="absolute font-bold text-gray-90 bg-opacity-60 transition duration-3000 p-6 bg-gray-50 top-0 right-0 bottom-0 translate-y-full hover:translate-y-0 ">
    Overview :<br>
     ${movie.overview}</div>
    <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt"${
      movie.title
    } class="w-full">
    </div>
    
    <div class="px-4 py-6 flex flex-col gap-4">
    <div class="relative flex items-center justify-between font-bold">
    <h3 class="text-xl text-${voteColor(
      parseFloat(movie.vote_average).toFixed(1)
    )}-500">${movie.title}</h3>
      <span id="vote" class="absolute -top-12 right-4 bg-gray-900 p-2 rounded-full text-${voteColor(
        parseFloat(movie.vote_average).toFixed(1)
      )}-500 shadow-xl shadow-${voteColor(
      parseFloat(movie.vote_average).toFixed(1)
    )}-300"><p>${parseFloat(movie.vote_average).toFixed(1)}</p></span>
    </div>
      <ul id=${movie.id} class="flex gap-4 items-center text-sm flex-wrap"></ul>
    </div>
    `;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    newDiv.appendChild(movieDiv);
    CONTAINER.appendChild(newDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, similarMovies) => {
  //To get the Director's Name
  const name = [];

  const names = credits.crew.map((eachCrewObject) => {
    if (eachCrewObject.known_for_department === "Directing") {
      name.push(eachCrewObject.name);
    }
    return name;
  });

  const directorsname = name[0];

  //To get the movie's Genres

  let movieGenres = movie.genres;
  const movieArrayGenre = [];

  movieGenres.map((eachGenreElement) => {
    movieArrayGenre.push(eachGenreElement.id);
  });

  //To Get similar Movies
  // if Similar Movies genres include MovieArrayGenre then need the title and image
  const similarMovResults = similarMovies.results;

  trailersList(movie.id);
  CONTAINER.innerHTML = `<div class="relative">
      
      <h1 class="text-center text-4xl pt-3 pb-8" id="movie-title"><b>${
        movie.title
      }</b></h1>
      <div class="grid grid-cols-3 lg:flex bg-black text-white mx-auto w-full">
         <div class="col-md-4">
           <img id="movie-backdrop" src=${
             BACKDROP_BASE_URL + movie.poster_path
           } class="rounded-xl">
          </div>

          <div class=" bg-black text-white w-full px-3 ">
            
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <p id="movie-language"><b>Movie's Language:</b> ${
              movie.original_language
            }</p>
            <p id="movie-rating"> <b>Movie Ratings </b>  ${parseFloat(
              movie.vote_average
            ).toFixed(1)} </p>
            <p id="recieved-votes"> <b> Recieved Votes: </b> ${
              movie.vote_count
            } votes</p>
            <p id="director-name"> <b>Director's Name</b> ${directorsname} </p>
            <h3 class="pt-6"><b>Overview:</b></h3>
            <p id="movie-overview">${movie.overview}</p>
            
          </div>
          
          <div class=" w-full px-3">
              <p id="production-company"><b>Production Company:</b> ${
                movie.production_companies[0].name
              }</p>
              <img class="w-52 h-auto pt-2"id="production-company-logo" src=${
                BACKDROP_BASE_URL + movie.production_companies[0].logo_path
              }> 
              <h3 class="pt-3"><b>5 Main Actors:</b></h3>
              <ul class=" pt-2 list-unstyled">
                  <li><a href="/">* ${credits.cast[0].name} </a></li>
                  <li><a href="/">* ${credits.cast[1].name} </a></li>
                  <li><a href="/">* ${credits.cast[2].name} </a></li>
                  <li><a href="/">* ${credits.cast[3].name} </a></li>
                  <li><a href="/">* ${credits.cast[4].name} </a></li>
              </ul>
          </div>
          
      </div> 
      <div class="movie-trailer pt-10 w-full text-center mx-auto" id="trailer${
        movie.id
      }">   
    </div>

      <div id="Related-Movies-Section class="text-center mx-auto px-3">
      <h3 class="py-6 px-3 text-2xl"><b>Related Movies:</b></h3>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-3 mx-auto">
             <div class="w-52">
                  <img src=${
                    BACKDROP_BASE_URL + similarMovResults[0].poster_path
                  }>
                  <p class="pt-2 text-center"><b>${
                    similarMovResults[0].title
                  }</b></p>
             </div>
             <div class="w-52">
                  <img src=${
                    BACKDROP_BASE_URL + similarMovResults[1].poster_path
                  }>
                  <p class="pt-2 text-center"><b>${
                    similarMovResults[1].title
                  }</b></p>
             </div>
             <div class="w-52">
                  <img src=${
                    BACKDROP_BASE_URL + similarMovResults[2].poster_path
                  }>
                  <p class="pt-2 text-center"><b>${
                    similarMovResults[2].title
                  }</b></p>
             </div>
             <div class="w-52">
                  <img src=${
                    BACKDROP_BASE_URL + similarMovResults[3].poster_path
                  }>
                  <p class="pt-2 text-center"><b>${
                    similarMovResults[3].title
                  }</b></p>
             </div>
             <div class="w-52">
                  <img src=${
                    BACKDROP_BASE_URL + similarMovResults[4].poster_path
                  }>
                  <p class="pt-2 text-center"><b>${
                    similarMovResults[4].title
                  }</b></p>
             </div>
             <div class="w-52">
                  <img src=${
                    BACKDROP_BASE_URL + similarMovResults[5].poster_path
                  }>
                  <p class="pt-2 text-center"><b>${
                    similarMovResults[5].title
                  }</b></p>
             </div>
         </div>
      </div>
      </div>

  `;
};

//! fetch movie trailer
const fetchTrailer = async (id) => {
  const url = constructUrl(`movie/${id}/videos`);
  const res = await fetch(url);
  return res.json();
};
const trailersList = async (id) => {
  const videos = await fetchTrailer(id);
  renderTrailer(videos.results[0], id);
};
const renderTrailer = (trailer, id) => {
  const trailerContainer = document.getElementById(`trailer${id}`);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("width", "560px");
  iframe.setAttribute("height", "315px");
  iframe.setAttribute("src", `${youtubeBaseUrl + trailer.key}`);

  iframe.setAttribute("frameborder", "0");
  trailerContainer.appendChild(iframe);
};
//! ends here
// FETCH GENRES AND IMPLEMENT THE FILTERING BASED ON GENDER
const fetchGenresName = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};
const genresDetails = async () => {
  const genre = await fetchGenresName();
  renderGenres(genre.genres);
};
const genresDetailsItem = async (ids, movieId) => {
  const genre = await fetchGenresName();
  const res = fun(genre.genres, ids, movieId);
  return res;
};
const fun = (path, id, movieId) => {
  const arr = [];
  const movie = document.getElementById(movieId);
  path.forEach((ele) => {
    const idArray = id;
    for (let i = 0; i < idArray.length; i++) {
      if (ele.id == idArray[i]) {
        arr.push(ele.name);
      }
    }
  });
  arr.forEach((ele) => {
    const li = document.createElement("li");
    li.classList.add(
      "px-2",
      "py-1",
      "bg-gray-900",
      "text-gray-50",
      "rounded-full",
      "bg-opacity-50"
    );
    li.innerHTML = `${ele}`;
    movie.appendChild(li);
  });
};
const renderGenres = (genre) => {
  const listContainer = document.getElementById("genreList");

  genre.forEach((ele) => {
    const listElement = document.createElement("li");
    const licontent = document.createElement("p");
    listElement.classList.add(
      "text-sm",
      "hover:bg-black",
      "text-white",
      "block",
      "px-4",
      "py-2"
    );
    licontent.innerText = `${ele.name}`;
    listElement.addEventListener("click", () => {
      if (selectedGenras.length === 0) {
        selectedGenras.push(ele.id);
      } else {
        if (selectedGenras.includes(ele.id)) {
          selectedGenras.forEach((id, indx) => {
            if (id === ele.id) {
              selectedGenras.splice(indx, 1);
            }
          });
        } else {
          selectedGenras.push(ele.id);
        }
      }
      // getFilterdMoviesByGenres();
      autorun(`discover/movie`, `&with_genres=${selectedGenras.join(",")}`);
    });
    listElement.appendChild(licontent);
    listElement.setAttribute("id", ele.name);
    listContainer.appendChild(listElement);
  });
};

//Fetching Actors and Single Actors //

const actorsSection = async () => {
  const actors = await fetchActors(); // added new for actors
  renderActors(actors.results); // added new for actors
};

// Actor Details Function
const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  const movieCredits = await fetchMovieCredits(actor.id);
  renderActor(actorRes, movieCredits);
};

// fetch Actors Function
const fetchActors = async () => {
  const url2 = constructUrl(`person/popular`);
  const res = await fetch(url2);
  return res.json();
};

//fetch Movie Credits Function for each Actor
const fetchMovieCredits = async (actorId) => {
  const url2 = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url2);
  return res.json();
};

//fetch Single Actor Function
const fetchActor = async (actorId) => {
  const url2 = constructUrl(`person/${actorId}`);
  const res = await fetch(url2);
  return res.json();
};

// renderActors Function
const renderActors = (actors) => {
  deletingContainerContent();
  const newDiv2 = document.createElement("div");
  newDiv2.classList.add(
    "grid",
    "grid-cols-1",
    "gap-6",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "lg:px-20"
  );
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.classList.add("actorContainer");
    actorDiv.innerHTML = `
      <div class= "w-80 mx-auto">
        <div class="image-container relative w-full border-8 border-black">
          <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${
      actor.name
    }" poster class=" home-actor-image opacity-100 block w-full h-auto">  
        </div>
        <h1 class= "text-center text-2xl md:text-3xl font-bold font-mono bg-black text-white h-20 md:h-28 lg:h-36 xl:h-28 m-auto p-3">${
          actor.name
        }</h1>
     </div> `;
    actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });

    newDiv2.appendChild(actorDiv);
    CONTAINER.appendChild(newDiv2);
  });
};

function getGender(actor) {
  let gender = "";
  if (actor.gender === 0) {
    gender = "not known";
  } else if (actor.gender === 1) {
    gender = "female";
  } else {
    gender = "male";
  }
  return gender;
}

function deathDate(actor) {
  let date = "";
  if (actor.deathday !== null) {
    date = `<b>Deathday:</b> ${actor.deathday} `;
  }
  return date;
}

//render Single Actor Function
const renderActor = (actor, movieCredits) => {
  CONTAINER.innerHTML = `
  <h1 class="text-center text-4xl pt-3 pb-8" id="actor-name"><b>${
    actor.name
  }</b> </h1>
<div class="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-20 bg-black text-white mx-auto">
    <div class= "mx-auto">
        <img id="actor-backdrop"  src=${
          PROFILE_BASE_URL + actor.profile_path
        } alt="${actor.name}">
    </diV>

   <div class="  w-full mx-auto px-2 pt-4 md:pt-0">
       <p id="actor-gender"><b>Gender:</b> ${getGender(actor)}</p>
       <p id="actor-popularity"><b>Popularity:</b> ${actor.popularity} </p>
       <p id="actor-birthday"><b>Birthday:</b> ${actor.birthday} </p>
       <p id="actor-deathday">${deathDate(actor)}</p>
       <h3 class="pt-6"><b>Biography:</b></h3>
       <p id="actor-biography">${actor.biography}</p>
   </div>
   
   <div class="mx-auto pr-2 pt-4 md:pt-0 w-full lg:pl-5">
   <h3><b>List of Movies the Actor Participated in:</b></h3>
   <ul class="pt-2">
        <li> ${movieCredits.cast[0].title}</li>
        <li> ${movieCredits.cast[1].title}</li>  
        <li> ${movieCredits.cast[2].title}</li>
        <li> ${movieCredits.cast[3].title}</li>
        <li> ${movieCredits.cast[4].title}</li>
        <li> ${movieCredits.cast[5].title} </li>
        <li> ${movieCredits.cast[6].title} </li>
    </ul> 
   </div> 
</div>`;
};
const voteColor = (vote) => {
  if (vote >= 8.5) {
    return `green`;
  } else if (vote < 8.5 && vote >= 7) {
    return `yellow`;
  } else if (vote < 7 && vote >= 5) {
    return `orange`;
  } else {
    return `red`;
  }
};
const form = document.getElementById("searchForm");
const searchInput = document.getElementById("simple-search");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value;

  if (searchValue) {
    autorun(`search/movie`, `&query=${searchValue}`);
  }
});
document.addEventListener("DOMContentLoaded", () =>
  autorun(`movie/now_playing`)
);
document
  .getElementById("top")
  .addEventListener("click", () => autorun(`movie/top_rated`));
document
  .getElementById("popular")
  .addEventListener("click", () => autorun(`movie/popular`));
document
  .getElementById("latest")
  .addEventListener("click", () => autorun(`discover/movie`, release));
document
  .getElementById("nowPlaying")
  .addEventListener("click", () => autorun(`movie/now_playing`));
document
  .getElementById("home")
  .addEventListener("click", () => autorun(`movie/now_playing`));
document
  .getElementById("logo")
  .addEventListener("click", () => autorun(`movie/now_playing`));
document
  .getElementById("upComing")
  .addEventListener("click", () => autorun(`movie/upcoming`));
document.getElementById("actors").addEventListener("click", actorsSection);

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    autorun(`movie/now_playing`, `&page=${prevPage}`);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    autorun(`movie/now_playing`, `&page=${nextPage}`);
  }
});
