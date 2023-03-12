
//------------------ FÖR VG-----------------------------------

//Metoderna
getFirstAppearance() {
console.log("Första framträdandet");
this.films.forEach(movie => {
    let data = getMovies(movie);
    console.log(data);
});
};

//Function för att skriva ut info?
async function infoToBox (data, text, property){
  let p = document.createElement("p");
   p.innerHTML = `${this.name} ${text} ${data.release_date} `
  infoBox.append(p);

}

//Funktion för att hämta filmer
// let getMovies = async (url) => {
//   let data = await fetch(`${url}`);
//   let json = data.json();
//   return json;
// }

// //Funktion för hämta hemplaneter
// let getPlanets = async (url) => {
//   let data = await fetch(`${url}`);
//   let json = data.json();
//   return json;
// }
//Funktion för att hämta starships och vehicles
// let getStarshipsVehicles = async (starship, vehicle) => {
//   let data1 = await fetch(`${starship}`);
//   let json1 = data1.json();

//   let data2 = await fetch(`${vehicle}`);
//   let json2 = data2.json();
// }


// FUNKTIONEN/METODEN FÖR ATT JÄMFÖRA KARAKTÄRERNAS FORDON
async mostExpensiveVehicle() {
  const characterStarships = this.starships;
  const characterVehicles = this.vehicles;

  let allShipsAndVehicles = characterStarships.concat(characterVehicles);

  console.log("alla för char 1: ", allShipsAndVehicles);

  await findTheExpensiveOne(allShipsAndVehicles);
}

//Funktion för att hitta den dyraste av fordonen
async function findTheExpensiveOne(data) {
  let mostExpensiveStarship = null;
  let mostExpensiveStarshipName = null;

    if(data.length === 0){
      let p = document.createElement("p");
      p.innerText = "These characters doesnt own any starships/vehicles! :("
      infoBox.append(p);    
    } else {

      for (let i = 0; i < arrayUrl.length; i++) {
        let starship = await getStarships(data[i]);
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
    }    
    
    //Skriv ut det här
    console.log(
      `${mostExpensiveStarshipName} kostar mest med ett pris på ${mostExpensiveStarship}`
      );
    };

