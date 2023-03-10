
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