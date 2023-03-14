class Character {
  constructor(
    name,
    gender,
    height,
    mass,
    hairColor,
    skinColor,
    eyeColor,
    films,
    homeworld,
    starships,
    vehicles,
    pictureUrl
  ) {
    this.name = name;
    this.gender = gender;
    this.height = Number(height);
    this.mass = Number(mass);
    this.hairColor = hairColor;
    this.skinColor = skinColor;
    this.eyeColor = eyeColor;
    this.films = films;
    this.homeworld = homeworld;
    this.starships = starships;
    this.vehicles = vehicles;
    this.pictureUrl = `./assets/${name}`;
  }

  //Det är data som blir datat man kan ta ut saker ifrån
  async getFirstAppearance() {
    let oldestMovie = this.films[0];

    for (let i = 0; i < this.films.length; i++) {
      await getData(this.films[i]);
      const releaseDate = new Date(this.films[i].release_date);
      if (releaseDate < oldestMovie.release_date) {
        oldestMovie = this.films[i];
      }
    }
    let data = await getData(oldestMovie);
    let p = document.createElement("p");
    p.innerHTML = `${this.name} first appearance was ${data.release_date} `;
    infoBox.append(p);
  }

  //Metod som jämför om karaktärerna varit med i samma filmer, movie.title är det som ska skrivas ut
  static async compareMovies(charactersArray, index1, index2) {
    const character1 = charactersArray[index1].films;
    const character2 = charactersArray[index2].films;

    const sameMoviesArray = character1.filter((movie) =>
      character2.includes(movie)
    );
    console.log(sameMoviesArray);

    let p = document.createElement("p");
    if (sameMoviesArray.length === 0) {
      p.innerText = `${charactersArray[index1].name} and ${charactersArray[index2].name} has not been in any movies together.`;
    } else {
      p.innerHTML = `${charactersArray[index1].name} and ${charactersArray[index2].name} were in these movies together: `;

      for (let i = 0; i < sameMoviesArray.length; i++) {
        let movie = await getData(sameMoviesArray[i]);
        p.innerHTML += `<p>${movie.title}</p>`;
      }
    }

    infoBox.append(p);
  }
  //Metod som jämför hemvärldar
  static async compareHomeworld(charactersArray, index1, index2) {
    const character1 = charactersArray[index1].homeworld;
    const character2 = charactersArray[index2].homeworld;
    console.log(character1, character2);
    let character1Home = await getData(character1);
    let character2Home = await getData(character2);

    if (character1Home.name === character2Home.name) {
      let p = document.createElement("p");
      p.innerHTML = `${charactersArray[index1].name} and ${charactersArray[index2].name} comes from the same homeworld ${character1Home.name}!`;
      infoBox.append(p);
    } else {
      let p = document.createElement("p");
      p.innerHTML = `${charactersArray[index1].name} and ${charactersArray[index2].name} do not come from the same homeworld. ${charactersArray[index1].name} comes from ${character1Home.name} and ${charactersArray[index2].name} comes from ${character2Home.name}!`;
      infoBox.append(p);
    }
  }

  async mostExpensiveVehicle() {
    const characterStarships = this.starships;
    const characterVehicles = this.vehicles;

    let allShipsAndVehicles = characterStarships.concat(characterVehicles);

    console.log("alla för char 1: ", allShipsAndVehicles);

    if (allShipsAndVehicles.length === 0) {
      let p = document.createElement("p");
      p.innerText = `${this.name} doesnt own any starships/vehicles! :(`;
      infoBox.append(p);
    } else {
      await findTheExpensiveOne(allShipsAndVehicles);
    }
  }
}

let characterList = [];
let numberOne;
let numberTwo;

const chooseCharacterBtn = document.querySelector(".chooseBtn");
const compareDiv = document.querySelector(".compare");
const characterDiv = document.querySelector(".characterDiv");
const comparisonDiv = document.querySelector(".comparison");
const restartDiv = document.querySelector(".restart");
const characterMethods = document.querySelector(".characterMethods");
const infoBox = document.querySelector(".infoBox");
const selectDiv = document.querySelector(".selectDiv");

//Dessa två är dropdownsen och XX.value ger det valda värdet
const dropdownOne = document.querySelector("select[name='characterSelectOne']");
const dropdownTwo = document.querySelector("select[name='characterSelectTwo']");

//Välja karaktärer-knappen
chooseCharacterBtn.addEventListener("click", () => {
  characterDiv.innerHTML = "";
  characterList = [];
  loadingModal("Loading characters... Please wait", 2500);
  findCharacterNumber();
  loadCharacter(numberOne, numberTwo);
  chooseCharacterBtn.remove();
  let restartBtn = document.createElement("button");
  restartBtn.innerText = "Click here to choose another character!";
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
  selectDiv.append(restartBtn);
});

//Laddar de två valda karaktärerna baserat på deras people-number i API:et
let loadCharacter = async (numberOne, numberTwo) => {
  try {
    let data1 = await fetch(`https://swapi.dev/api/people/${numberOne}/`);
    let json1 = await data1.json();
    console.log(json1);

    let data2 = await fetch(`https://swapi.dev/api/people/${numberTwo}/`);
    let json2 = await data2.json();
    console.log(json2);

    if (characterList.length < 2) {
      createCharacterInstance(json1, json2);
      renderCharacters(json1, json2);
    } else if (characterList.length === 2) {
      console.log("Du har för många karaktärer i ");
    }
    return json1, json2;
  } catch (error) {
    infoBox.innerHTML =
      "Sorry, something went wrong, please reload page: \n" +
      error.name +
      "<br>" +
      error.message;
  }
};

let findCharacterNumber = () => {
  switch (dropdownOne.value) {
    case "R2D2":
      numberOne = 3;
      break;
    case "Chewbacca":
      numberOne = 13;
      break;
    case "Leia Organa":
      numberOne = 5;
      break;
    case "Obi-Wan Kenobi":
      numberOne = 10;
      break;
    case "Darth Vader":
      numberOne = 4;
      break;
    case "C-3PO":
      numberOne = 2;
      break;
    case "Luke Skywalker":
      numberOne = 1;
      break;
  }
  console.log("number dropD one: ", numberOne);

  switch (dropdownTwo.value) {
    case "R2D2":
      numberTwo = 3;
      break;
    case "Chewbacca":
      numberTwo = 13;
      break;
    case "Leia Organa":
      numberTwo = 5;
      break;
    case "Obi-Wan Kenobi":
      numberTwo = 10;
      break;
    case "Darth Vader":
      numberTwo = 4;
      break;
    case "C-3PO":
      numberTwo = 2;
      break;
    case "Luke Skywalker":
      numberTwo = 1;
      break;
  }
  console.log("number dropD two: ", numberTwo);
};

let createCharacterInstance = (objectOne, objectTwo) => {
  let createInstanceForObject = (object) => {
    let {
      name,
      gender,
      height,
      mass,
      hair_color: hairColor,
      skin_color: skinColor,
      eye_color: eyeColor,
      films,
      homeworld,
      starships,
      vehicles,
    } = object;

    let newCharacter = new Character(
      name,
      gender,
      height,
      mass,
      hairColor,
      skinColor,
      eyeColor,
      films,
      homeworld,
      starships,
      vehicles,
      name
    );
    characterList.push(newCharacter);

    console.log(characterList);
  };
  createInstanceForObject(objectOne);
  createInstanceForObject(objectTwo);
};

//Funktion för att rendera ut de två valda karaktärerna

let renderCharacters = (objectOne, objectTwo) => {
  let renderCharacter = (object) => {
    let characterCard = document.createElement("div");
    characterCard.className = "charactercard";
    characterCard.innerHTML = `<p>Name: ${object.name}</p>
              <img src="./assets/${object.name}.jpg" alt="Img of ${object.name}"></img>
              `;

    characterDiv.append(characterCard);
  };
  renderCharacter(objectOne);
  renderCharacter(objectTwo);

  let compareBtn = document.createElement("button");
  compareBtn.className = "compareBtn";
  compareBtn.innerText = "Compare Characters";
  compareDiv.append(compareBtn);

  compareBtn.addEventListener("click", () => {
    compareBtn.style = `display: none`;
    statsDivFunction();

    characterList.forEach((character, index) => {
      let {
        name,
        gender,
        height,
        mass,
        hairColor,
        skinColor,
        eyeColor,
        films,
      } = character;

      if (gender === "n/a") {
        gender = "No data";
      }
      if (hairColor === "n/a") {
        hairColor = "No data";
      }
      if (skinColor === "n/a") {
        skinColor = "No data";
      }

      let div = document.createElement("div");
      div.className = name;
      div.innerHTML = `<progress value="${gender}"></progress>
      <progress value="${hairColor}"></progress>
      <progress name="height" value="${height}" min="0" max="250"></progress>
      <progress value="${mass}" min="0" max="150"></progress>
      <progress value="${skinColor}"></progress>
      <progress value="${eyeColor}"></progress>
      <progress name="films" value="${films.length}" min="0" max="7"></progress>`;

      if (index % 2 === 0) {
        div.classList.add("leftDiv");
        comparisonDiv.insertBefore(div, comparisonDiv.firstChild);
      } else {
        comparisonDiv.appendChild(div);
      }

      let firstABtn = document.createElement("button");
      firstABtn.innerText = "First Appearance";

      const mostExpensiveBtn = document.createElement("button");
      mostExpensiveBtn.innerText = "Most Expensive ride";

      div.append(firstABtn, mostExpensiveBtn);

      firstABtn.addEventListener("click", () => {
        loadingModal("Loading first appearance... Please wait", 2500);

        character.getFirstAppearance();
      });

      mostExpensiveBtn.addEventListener("click", () => {
        loadingModal(
          "Loading the most expensive vechicle... Please wait",
          2500
        );

        character.mostExpensiveVehicle();
      });
    });

    compareCharacters(characterList, 0, 1);

    const sameMovieBtn = document.createElement("button");
    sameMovieBtn.innerText = "Compare Movies";
    sameMovieBtn.addEventListener("click", () => {
      loadingModal("Loading comparison... Please wait", 2500);
      Character.compareMovies(characterList, 0, 1);
    });

    const homeworldBtn = document.createElement("button");
    homeworldBtn.innerText = "Compare Homeworld";
    homeworldBtn.addEventListener("click", () => {
      infoBox.innerHTML = "";
      loadingModal("Loading comparison... Please wait", 2500);
      Character.compareHomeworld(characterList, 0, 1);
    });

    characterMethods.append(sameMovieBtn, homeworldBtn);
  });
};

//Funktion som jämför alla properties för valda karaktärer
let compareCharacters = (charactersArr, index1, index2) => {
  const character1 = charactersArr[index1];
  const character2 = charactersArr[index2];

  let genderRight = document.getElementById("Gender_right");
  let genderLeft = document.getElementById("Gender_left");

  let haircolorLeft = document.getElementById("Haircolor_left");
  let haircolorRight = document.getElementById("Haircolor_right");

  let heightLeft = document.getElementById("Height_left");
  let heightRight = document.getElementById("Height_right");

  let massLeft = document.getElementById("Mass_left");
  let massRight = document.getElementById("Mass_right");

  let skincolorLeft = document.getElementById("Skincolor_left");
  let skincolorRight = document.getElementById("Skincolor_right");

  let eyecolorLeft = document.getElementById("Eyecolor_left");
  let eyecolorRight = document.getElementById("Eyecolor_right");

  let filmsLeft = document.getElementById("Films_left");
  let filmsRight = document.getElementById("Films_right");

  if (character1.gender === character2.gender) {
    genderRight.style = "visibility: visible";
    genderLeft.style = "visibility: visible";
    genderLeft.nextElementSibling.style.fontWeight = "bolder";
  }

  if (character1.hairColor === character2.hairColor) {
    haircolorRight.style = "visibility: visible";
    haircolorLeft.style = "visibility: visible";
    haircolorLeft.nextElementSibling.style = `color: ${character1.hairColor}; font-weight: bolder`;
  }
  if (character1.height > character2.height) {
    heightLeft.style = "visibility: visible";
  } else if (character2.height > character1.height) {
    heightRight.style = "visibility: visible";
  }

  if (character1.mass > character2.mass) {
    massLeft.style = "visibility: visible";
  } else if (character2.mass > character1.mass) {
    massRight.style = "visibility: visible";
  }

  if (character1.skinColor === character2.skinColor) {
    skincolorRight.style = "visibility: visible";
    skincolorLeft.style = "visibility: visible";
    skincolorLeft.nextElementSibling.style = `color: ${character1.skinColor}; font-weight: bolder`;
  }
  if (character1.eyeColor === character2.eyeColor) {
    eyecolorRight.style = "visibility: visible";
    eyecolorLeft.style = "visibility: visible";
    eyecolorLeft.nextElementSibling.style = `color: ${character1.eyeColor}; font-weight: bolder`;
  }

  if (character1.films.length === character2.films.length) {
    filmsRight.style = "visibility: visible";
    filmsLeft.style = "visibility: visible";
    filmsLeft.nextElementSibling.style = `font-weight: bolder`;
  } else if (character1.films.length > character2.films.length) {
    filmsLeft.style = "visibility: visible";
  } else if (character2.films.length > character1.films.length) {
    filmsRight.style = "visibility: visible";
  }
};

function toogleVisibility(element) {
  element.style = "visibility: visible";
}

//Funktion för att rendera ut statistik-diven i mitten
let statsDivFunction = () => {
  let statsDiv = document.createElement("div");
  statsDiv.className = "statsDiv";
  statsDiv.innerHTML = `<div><div id="Gender_left" style="visibility:hidden">&#11013;</div><label for="gender">Gender</label><div id="Gender_right" style="visibility:hidden">&#10145</div></div>
  <div><div id="Haircolor_left" style="visibility:hidden">&#11013;</div><label for="hairColor">Haircolor</label><div id="Haircolor_right" style="visibility:hidden">&#10145</div></div>
  <div><div id="Height_left" style="visibility:hidden">&#11013;</div><label for="height">Height</label><div id="Height_right" style="visibility:hidden">&#10145</div></div>
  <div><div id="Mass_left" style="visibility:hidden">&#11013;</div><label for="mass">Mass</label><div id="Mass_right" style="visibility:hidden">&#10145</div></div>
  <div><div id="Skincolor_left" style="visibility:hidden">&#11013;</div><label for="skinColor">Skincolor</label><div id="Skincolor_right" style="visibility:hidden">&#10145</div></div>
  <div><div id="Eyecolor_left" style="visibility:hidden">&#11013;</div><label for="eyeColor">Eyecolor</label><div id="Eyecolor_right" style="visibility:hidden">&#10145</div></div>
  <div><div id="Films_left" style="visibility:hidden">&#11013;</div><label for="films">Movies</label><div id="Films_right" style="visibility:hidden">&#10145</div></div>`;
  comparisonDiv.append(statsDiv);
};

//Funktion för att hämta data från API:et
let getData = async (url) => {
  try {
    let data = await fetch(`${url}`);
    let json = await data.json();
    return json;
  } catch (error) {
    infoBox.innerHTML =
      "Sorry, something went wrong, please reload page: \n" +
      error.name +
      "<br>" +
      error.message;
  }
};

//Funktion för att hitta den dyraste av fordonet
async function findTheExpensiveOne(data) {
  let mostExpensiveStarship = null;
  let mostExpensiveStarshipName = null;

  for (let i = 0; i < data.length; i++) {
    let starship = await getData(data[i]);
    console.log(
      "Fordonets kostnad + namn: ",
      starship.cost_in_credits,
      starship.name
    );
    if (
      starship.cost_in_credits !== "unknown" &&
      (!mostExpensiveStarship ||
        parseInt(starship.cost_in_credits) > mostExpensiveStarship)
    ) {
      mostExpensiveStarship = parseInt(starship.cost_in_credits);
      mostExpensiveStarshipName = starship.name;
    }
  }
  let p = document.createElement("p");
  p.innerText = `${mostExpensiveStarshipName} is the most expensive vehicle/starship and costs : ${mostExpensiveStarship}`;
  infoBox.append(p);
}

function loadingModal(text, time) {
  let modal = document.createElement("div");

  modal.innerText = text;
  modal.className = "loading-modal";
  modal.style = `color: #f5d5e0; font-weight: bold;`;
  infoBox.innerHTML = "";
  infoBox.prepend(modal);
  setTimeout(() => {
    infoBox.removeChild(modal);
  }, time);
}
