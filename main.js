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
    vehicles
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

  //Metod som letar filmen med tidigaste release-datum
  async getFirstAppearance() {
    loadingModal("Loading first appearance...");
    let oldestMovie = this.films[0];

    for (let i = 0; i < this.films.length; i++) {
      await getData(this.films[i]);
      const releaseDate = new Date(this.films[i].release_date);
      if (releaseDate < oldestMovie.release_date) {
        oldestMovie = this.films[i];
      }
    }
    let data = await getData(oldestMovie);
    infoBox.removeChild(document.querySelector(".loading-modal"));
    let p = document.createElement("p");
    p.innerHTML = `${this.name} first appearance was ${data.release_date} `;
    infoBox.append(p);
  }

  //Metod som jämför om karaktärerna varit med i samma filmer, movie.title är det som ska skrivas ut
  static async compareMovies(charactersArray, index1, index2) {
    loadingModal("Loading movies...");
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
    infoBox.removeChild(document.querySelector(".loading-modal"));
    infoBox.append(p);
  }
  //Metod som jämför hemvärldar
  static async compareHomeworld(charactersArray, index1, index2) {
    const character1 = charactersArray[index1].homeworld;
    const character2 = charactersArray[index2].homeworld;

    loadingModal("Loading homeworld data...");
    let character1Home = await getData(character1);
    let character2Home = await getData(character2);
    infoBox.removeChild(document.querySelector(".loading-modal"));

    let p = document.createElement("p");
    if (character1Home.name === character2Home.name) {
      p.innerHTML = `${charactersArray[index1].name} and ${charactersArray[index2].name} comes from the same homeworld ${character1Home.name}!`;
    } else {
      p.innerHTML = `${charactersArray[index1].name} and ${charactersArray[index2].name} do not come from the same homeworld.<br>${charactersArray[index1].name} comes from ${character1Home.name} and ${charactersArray[index2].name} comes from ${character2Home.name}!`;
    }
    infoBox.append(p);
  }

  async mostExpensiveVehicle() {
    const characterStarships = this.starships;
    const characterVehicles = this.vehicles;
    loadingModal("Loading the most expensive vechicle...");
    let allShipsAndVehicles = characterStarships.concat(characterVehicles);

    if (allShipsAndVehicles.length === 0) {
      infoBox.removeChild(document.querySelector(".loading-modal"));
      let p = document.createElement("p");
      p.innerText = `${this.name} doesn't own any starships/vehicles! :(`;
      infoBox.append(p);
    } else {
      await findTheExpensiveOne(allShipsAndVehicles);
      infoBox.removeChild(document.querySelector(".loading-modal"));
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

const characterMethods = document.querySelector(".characterMethods");
const infoBox = document.querySelector(".infoBox");
const selectDiv = document.querySelector(".selectDiv");
const dropdownOne = document.querySelector("select[name='characterSelectOne']");
const dropdownTwo = document.querySelector("select[name='characterSelectTwo']");

//Välja karaktärer-knappen
chooseCharacterBtn.addEventListener("click", () => {
  loadingModal("Loading characters...");
  characterDiv.innerHTML = "";
  characterList = [];
  findCharacterNumber();
  loadCharacter(numberOne, numberTwo);
  chooseCharacterBtn.remove();
  let restartBtn = document.createElement("button");
  restartBtn.innerText = "Click here to choose again!";
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
  selectDiv.append(restartBtn);
  dropdownOne.disabled = true;
  dropdownTwo.disabled = true;
});

//Laddar de två valda karaktärerna baserat på deras people-number i API:et
let loadCharacter = async (numberOne, numberTwo) => {
  try {
    let data1 = await fetch(`https://swapi.dev/api/people/${numberOne}/`);
    let json1 = await data1.json();
    let data2 = await fetch(`https://swapi.dev/api/people/${numberTwo}/`);
    let json2 = await data2.json();

    createCharacterInstance(json1, json2);
    renderCharacters(json1, json2);

    return json1, json2;
  } catch (error) {
    infoBox.innerHTML =
      "Sorry, something went wrong, please reload page: \n" +
      error.name +
      "<br>" +
      error.message;
  }
};

//Funktion som kollar value i dropdown och sätter en variabel till karaktärens url-nummer.
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
};

//Funktion som skapar instanser av Character. Den tar emot två objekt och därför är det en funktion inuti som hanterar vardera objekt.
let createCharacterInstance = (objectOne, objectTwo) => {
  let createInstanceForObject = (object) => {
    let newObject = {};
    for (let [key, value] of Object.entries(object)) {
      if (typeof value === "string") {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      newObject[key] = value;
    }

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
    } = newObject;

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
  };
  createInstanceForObject(objectOne);
  createInstanceForObject(objectTwo);
  console.log("Array med karaktärer: ", characterList);
};

//Funktion för att rendera ut de två valda karaktärerna.
let renderCharacters = (objectOne, objectTwo) => {
  let renderCharacter = (object) => {
    let characterCard = document.createElement("div");
    characterCard.className = "charactercard";
    characterCard.innerHTML = `<p>${object.name}</p>
              <img src="./assets/${object.name}.jpg" alt="Img of ${object.name}"></img>
              `;
    characterDiv.append(characterCard);
  };
  renderCharacter(objectOne);
  renderCharacter(objectTwo);
  infoBox.innerText =
    "These are your chosen characters. Press the button to compare them.";

  let compareBtn = document.createElement("button");
  compareBtn.className = "compareBtn";
  compareBtn.innerText = "Compare Characters";
  compareDiv.append(compareBtn);

  compareBtn.addEventListener("click", () => {
    compareBtn.style = `display: none`;
    infoBox.innerText =
      "Here you can see a comparison of which character is the longest, heaviest and who has been in the most films. If the values ​​match for any property, it is highlighted with the arrows.";
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

      if (gender === "N/a") {
        gender = "No data";
      }
      if (hairColor === "N/a") {
        hairColor = "No data";
      }
      if (skinColor === "N/a") {
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
        character.getFirstAppearance();
      });

      mostExpensiveBtn.addEventListener("click", () => {
        character.mostExpensiveVehicle();
      });
    });

    compareCharacters(characterList, 0, 1);

    const sameMovieBtn = document.createElement("button");
    sameMovieBtn.innerText = "Compare Movies";
    sameMovieBtn.addEventListener("click", () => {
      Character.compareMovies(characterList, 0, 1);
    });

    const homeworldBtn = document.createElement("button");
    homeworldBtn.innerText = "Compare Homeworld";
    homeworldBtn.addEventListener("click", () => {
      Character.compareHomeworld(characterList, 0, 1);
    });

    characterMethods.append(sameMovieBtn, homeworldBtn);
  });
};

//Funktion som jämför alla properties för valda karaktärer
let compareCharacters = (charactersArr, index1, index2) => {
  const character1 = charactersArr[index1];
  const character2 = charactersArr[index2];

//Alla mina divs med pilar i
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

  //Alla jämförelser att kolla på, har lagt värdet "string" i leftIsBigger på de värden som inte ska kunna jämföras om de är större än det andra
  showComparison(genderLeft, genderRight, character1.gender === character2.gender,"string", "string");
  showComparison(haircolorLeft, haircolorRight, character1.hairColor === character2.hairColor, "string", "string");
  showComparison(heightLeft, heightRight, character1.height === character2.height, character1.height > character2.height, "number");
  showComparison(massLeft, massRight, character1.mass === character2.mass, character1.mass > character2.mass, "number");
  showComparison(skincolorLeft, skincolorRight, character1.skinColor === character2.skinColor, "string", "string");
  showComparison(eyecolorLeft, eyecolorRight, character1.eyeColor === character2.eyeColor, "string", "string");
  showComparison(filmsLeft, filmsRight, character1.films.length === character2.films.length, character1.films.length > character2.films.length, "number");
};

//Funktion för att jämföra alla properties och visa ut pilarna som indikerar att de har samma värde som den jämförda karaktären eller om någon är längre/tyngre/varit med i fler filmer
function showComparison(leftElem, rightElem, isEqual, leftIsBigger, type) {
  
  if (type === "string" && isEqual){
      leftElem.style = "visibility: visible";
      rightElem.style = "visibility: visible";
      leftElem.nextElementSibling.style.fontWeight = "bolder";
    }
  if (type === "number" && isEqual){
      leftElem.style = "visibility: visible";
      rightElem.style = "visibility: visible";
      leftElem.nextElementSibling.style.fontWeight = "bolder";
    } else if(type === "number" && leftIsBigger){
      leftElem.style = "visibility: visible";
    } else if(type === "number" && !leftIsBigger) {
      rightElem.style = "visibility: visible";
    }
};
 
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

//Funktion för att hämta data från API:et, den tar alltid emot en url
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

//Funktion för att hitta den dyraste av fordonen
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
  if (mostExpensiveStarship !== null) {
    let p = document.createElement("p");
    p.innerText = `${mostExpensiveStarshipName} is this characters most expensive vehicle/starship and costs : ${mostExpensiveStarship}`;
    infoBox.append(p);
  } else {
    let p = document.createElement("p");
    p.innerText = `The character starship/vehicle has an unknown value.`;
    infoBox.append(p);
  }
}
//Funktion för Loading meddelande
function loadingModal(text) {
  let modal = document.createElement("div");
  modal.innerText = text;
  modal.className = "loading-modal";
  infoBox.innerHTML = "";
  infoBox.append(modal);
}
