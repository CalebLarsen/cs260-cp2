function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const P = new Pokedex.Pokedex();

let pokemon1 = null;
let pokemon2 = null;
let move1 = null;
let move2 = null;
let fought = false;


async function getPokemon(num){
  const pokemon = await P.getPokemonByName(Math.floor(Math.random()*150 + 1));
  if (num === 1) {
    pokemon1 = pokemon;
  } else {
    pokemon2 = pokemon;
  }
  // Add Pokemon Name
  let html = "<div class=poke-name>" + capitalize(pokemon.species.name) + "</div>";
  // Add picture
  let img = new Image();
  img.src = pokemon.sprites.front_default;
  return [html, img];
}
async function updatePokemon(){
  fought = false;
  document.getElementById("winner").innerText = "";
  const data1 = await getPokemon(1);
  const data2 = await getPokemon(2);


  move1 = await getMove(pokemon1);
  move2 = await getMove(pokemon2);

  p1 = document.getElementById("pokemon1");
  p2 = document.getElementById("pokemon2");

  p1.innerHTML = "";
  p2.innerHTML = "";

  p1.appendChild(data1[1]);
  p2.appendChild(data2[1]);

  p1.innerHTML += data1[0] + "<div class='move-name'>" + capitalize(move1.name) + "</div>";

  p2. innerHTML += data2[0] + "<div class='move-name'>" + capitalize(move2.name) + "</div>";
}

async function getMove(p) {
  moveNum = Math.floor(Math.random() * p.moves.length);
  return p.moves[moveNum].move;
}

function getType(p) {
  if (p.types.length > 1) {
    for (let t of p.types){
      if (t.slot === 1) {
        return t.type.name;
      }
    }
  }
  return p.types[0].type.name;
}

function arrayHasType(a, type){
  for (let t of a) {
    if (t.name === type){
      return true;
    }
  }
  return false;
}

async function fight(){
  if (fought){
    return;
  }
  fought = true;
  move1 = await P.getMoveByName(move1.name);
  move2 = await P.getMoveByName(move2.name);


  type1 = await P.getTypeByName(move1.type.name);
  type2 = await P.getTypeByName(move2.type.name);

  let p1Dmg = 0;
  let p2Dmg = 0;
  if (arrayHasType(type1.damage_relations.double_damage_to, getType(pokemon2))){
    p1Dmg = 2;
  } else if (arrayHasType(type1.damage_relations.half_damage_to, getType(pokemon2))){
    p1Dmg = .5;
  } else if (arrayHasType(type1.damage_relations.no_damage_to, getType(pokemon2))){
    p1Dmg = 0;
  } else {
    p1Dmg = 1;
  }

  if (arrayHasType(type2.damage_relations.double_damage_to, getType(pokemon1))){
    p2Dmg = 2;
  } else if (arrayHasType(type2.damage_relations.half_damage_to, getType(pokemon1))){
    p2Dmg = .5;
  } else if (arrayHasType(type2.damage_relations.no_damage_to, getType(pokemon1))){
    p2Dmg = 0;
  } else {
    p2Dmg = 1;
  }
  if (p1Dmg == p2Dmg){
    p1Dmg = move1.power;
    p2Dmg = move2.power;
    if (p1Dmg == null){
      p1Dmg = 0;
    }
    if (p2Dmg == null){
      p2Dmg = 0;
    }
  }
  console.log(p1Dmg, p2Dmg);
  if (p1Dmg > p2Dmg){
    // Pokemon 1 wins
    document.getElementById("winner").innerText = capitalize(pokemon1.name) + " wins!";
  } else if (p2Dmg > p1Dmg){
    // Pokemon 2 wins
    document.getElementById("winner").innerText = capitalize(pokemon2.name) + " wins!";
  } else {
    // Tie
    document.getElementById("winner").innerText = "Tie!";
  }
}

document.getElementById("roll").onclick = updatePokemon;

document.getElementById("fight").onclick = fight;

updatePokemon();
