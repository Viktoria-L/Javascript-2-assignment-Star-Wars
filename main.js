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
    this.height = height;
    this.mass = mass;
    this.hairColor = hairColor;
    this.skinColor = skinColor;
    this.eyeColor = eyeColor;
    this.films = films;
    this.homeworld = homeworld;
    this.starships = starships,
    this.vehicles = vehicles,
    this.pictureUrl = `./assets/${name}`;
  }

  //Det är data som blir datat man kan ta ut saker ifrån
  async getFirstAppearance() {
    console.log("Första framträdandet");
    let oldestMovie = this.films[0];

    for (let i = 0; i < this.films.length; i++) {
      await getMovies(this.films[i]);
      if (this.films[i].release_date < oldestMovie.release_date) {
        oldestMovie = this.films[i];
      }
    }
    let data = await getMovies(oldestMovie);
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
    p.innerHTML = `${charactersArray[index1].name} and ${charactersArray[index2].name} were in these movies together: `;

    for (let i = 0; i < sameMoviesArray.length; i++) {
      let movie = await getMovies(sameMoviesArray[i]);

      p.innerHTML += `<p>${movie.title}</p>`;
    }

    infoBox.append(p);
  }
//Metod som jämför hemvärldar
  static async compareHomeworld(charactersArray, index1, index2) {
    const character1 = charactersArray[index1].homeworld;
    const character2 = charactersArray[index2].homeworld;
    console.log(character1, character2);
    let character1Home = await getPlanets(character1);
    let character2Home = await getPlanets(character2);

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

  static async mostExpensiveVehicle(charactersArray, index1, index2){
    
    
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

//Dessa två är dropdownsen och XX.value ger det valda värdet
const dropdownOne = document.querySelector("select[name='characterSelectOne']");
const dropdownTwo = document.querySelector("select[name='characterSelectTwo']");

//Laddar de två valda karaktärerna baserat på deras people-number i API:et
let loadCharacter = async (numberOne, numberTwo, event) => {
  try {
    let data1 = await fetch(`https://swapi.dev/api/people/${numberOne}/`);
    let json1 = await data1.json();
    console.log(json1);

    let data2 = await fetch(`https://swapi.dev/api/people/${numberTwo}/`);
    let json2 = await data2.json();
    console.log(json2);

    if (characterList.length < 2) {
      createCharacterInstance(json1, json2);
      renderCharacters(json1, json2, event);
    } else if (characterList.length === 2) {
      console.log("Du har för många karaktärer i ");
    }
    return json1, json2;
  } catch (error) {
    console.log(error);
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
    case "Luminara Unduli":
      numberOne = 64;
      break;
    case "Lama Su":
      numberOne = 72;
      break;
    case "Tarfful":
      numberOne = 80;
      break;
    case "Dud Bolt":
      numberOne = 48;
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
    case "Luminara Unduli":
      numberTwo = 64;
      break;
    case "Lama Su":
      numberTwo = 72;
      break;
    case "Tarfful":
      numberTwo = 80;
      break;
    case "Dud Bolt":
      numberTwo = 48;
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
    console.log(newCharacter);
    characterList.push(newCharacter);

    console.log(characterList);
  };
  createInstanceForObject(objectOne);
  createInstanceForObject(objectTwo);
};

//Funktion för att rendera de två valda karaktärerna

let renderCharacters = (objectOne, objectTwo, event) => {
  let renderCharacter = (object) => {
    let characterCard = document.createElement("div");
    characterCard.className = "charactercard";
    characterCard.innerHTML = `<p>Namn: ${object.name}</p>
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

      //SÄTT andra saker på not around-grejer!!!!!
      if (gender === "n/a") {
        gender = "No data";
      }
      //JUSTERA DEN OVANFÖR-------------------------

      let div = document.createElement("div");
      div.className = name;
      div.innerHTML = `<progress value="${gender}"></progress>
      <progress value="${hairColor}"></progress>
      <progress name="height" value="${height}" min="0" max="500"></progress>
      <progress value="${mass}"></progress>
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
      let sameMovieBtn = document.createElement("button");
      sameMovieBtn.innerText = "Compare Movies";
      let homeworldBtn = document.createElement("button");
      homeworldBtn.innerText = "Compare Homeworld";

      characterMethods.append(firstABtn, sameMovieBtn, homeworldBtn);

      firstABtn.addEventListener("click", () => {
        character.getFirstAppearance();
      });
      sameMovieBtn.addEventListener("click", () => {
        Character.compareMovies(characterList, 0, 1);
      });
      homeworldBtn.addEventListener("click", () => {
        Character.compareHomeworld(characterList, 0, 1);
      });
    });

    let restartBtn = document.createElement("button");
    restartBtn.innerText = "Click to restart!";
    restartBtn.addEventListener("click", () => {
      location.reload();
    });
    restartDiv.append(restartBtn);
  });
};

let compareCharacters = (object) => {};

//Välja karaktärer-knappen
chooseCharacterBtn.addEventListener("click", (e) => {
  characterDiv.innerHTML = "";
  characterList = [];
  console.log(characterList);
  findCharacterNumber();
  loadCharacter(numberOne, numberTwo, e);
});

//Funktion för att rendera ut statistik-diven i mitten
let statsDivFunction = () => {
  let statsDiv = document.createElement("div");
  statsDiv.className = "statsDiv";
  statsDiv.innerHTML = `<label for="gender">Gender</label>
  <label for="hairColor">Haircolor</label>
  <label for="height">Height</label>
  <label for="mass">Mass</label>
  <label for="skinColor">Skincolor</label>
  <label for="eyeColor">Eyecolor</label>
  <label for="films">How many movies</label>
  
  `;
  comparisonDiv.append(statsDiv);
};

//Denna ska köras när man trycker på compareBtn , inte här!
statsDivFunction();

//Funktion för att hämta filmer
let getMovies = async (url) => {
  let data = await fetch(`${url}`);
  let json = data.json();
  return json;
};

//Funktion för hämta hemplaneter
let getPlanets = async (url) => {
  let data = await fetch(`${url}`);
  let json = data.json();
  return json;
};

//Funktion för att hämta starships och vehicles
let getStarshipsVehicles = async (starshipUrl, vehicleUrl) => {
  let data1 = await fetch(`${starshipUrl}`);
  let json1 = data1.json();

  let data2 = await fetch(`${vehicleUrl}`);
  let json2 = data2.json();
  return json1, json2;  
}
