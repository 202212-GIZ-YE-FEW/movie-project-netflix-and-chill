'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const persons = await fetchPersons();
  renderPersons(persons.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchPersons = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.


// You'll need to play with this function in order to add features and enhance the style.
const renderPersons = (persons) => {
  persons.map((person) => {
  const personDiv = document.createElement("div");
   personDiv.className = "bigCard" 
  //  const row = document.createElement("div")
  //   column.className = "row"
  //  for(let i =0 ;i<=3;i++){
  //   const column = document.createElement("div")
  //   column.className = "column"

  //  }
    personDiv.innerHTML = `
    <div class="card" style="width: 18rem;">
    
    <div class= "onHover">
    <p>ipsum Lorem ipsum dolor sit, amet consectetur adipisicing elit.
     Error ullam accusamus soluta. Necessitatibus labore soluta dicta,
      quas facere, asperiores quisquam, reiciendis temporibus debitis corporis maiores.
       Dignissimos, sapiente reprehenderit! Blanditiis, numquam?
    </p>
    </div>
    
    <img class="card-img-top"src="${PROFILE_BASE_URL + person.profile_path}" alt="${
        person.name}">
    <div class="card-body">
    
    <h3>${person.name}</h3>
      <p class="card-text">add movies that he act</p>
    </div>
  </div>
    `;
// 
    personDiv.addEventListener("click", () => {
      console.log("Clicked")

    });

    CONTAINER.appendChild(personDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.

document.addEventListener("DOMContentLoaded", autorun);
