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
    this.pictureUrl = `./assets/${name}`;
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
      name
    );
    console.log(newCharacter);
    characterList.push(newCharacter);

    console.log(characterList);
  };
  createInstanceForObject(objectOne);
  createInstanceForObject(objectTwo);
};

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
      if(gender === "n/a"){
        gender = "No data";
      }
      let div = document.createElement("div");
      div.className = name;
      div.innerHTML = `<p>${gender}</p>
      <p>${hairColor}</p>
      <progress name="height" value="${height}" min="0" max="500"></progress>
      <p>${mass}</p>
      <p>${skinColor}</p>
      <p>${eyeColor}</p>
      <progress name="films" value="${films.length}" min="0" max="7"></progress>`;

      if(index % 2 === 0){
        div.classList.add("leftDiv");
      comparisonDiv.insertBefore(div, comparisonDiv.firstChild);
      } else {
        comparisonDiv.appendChild(div);
      }
    });
    let restartBtn = document.createElement("button");
    restartBtn.innerText = "Click to restart!"
    restartBtn.addEventListener("click", ()=>{
      location.reload();
    })
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


//Funktion för att rendera ut statistik-diven
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
}

statsDivFunction();