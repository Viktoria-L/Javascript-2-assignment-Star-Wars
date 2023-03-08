class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, pictureUrl) {
        this.name = name;
        this.gender = gender;
        this.height = height;
        this.mass = mass;
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.pictureUrl = pictureUrl;
    }
}

const characterOneBtn = document.querySelector(".chooseOne");
const characterTwoBtn = document.querySelector(".chooseTwo");

//Dessa två är dropdownsen och XX.value ger det valda värdet
const dropdownOne = document.querySelector("select[name='characterSelectOne']");
const dropdownTwo = document.querySelector("select[name='characterSelectTwo']");

let loadCharacter = async (character) => {
    let response = await fetch(`https://swapi.dev/api/people/${character}/`);
  let json = await response.json();
  console.log(json);
  return json;
}

let findCharacterNumber = () =>{

}

let createCharacterInstance = () => {
    
}


//Event Listeners på knapparna för att ladda data till valda karaktärer
characterOneBtn.addEventListener("click", (e)=>{
    console.log(dropdownOne.value);
})