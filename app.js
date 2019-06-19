const express = require('express');
const axios = require('axios');
const app = express();
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

var cors = require('cors');

app.use(cors())

getData = () => {
    return new Promise((resolve, reject) => {
        let allData = new Array;
        axios.get("https://pokeapi.co/api/v2/pokemon/?&limit=20").then(response => {
            data = response.data.results;
            response.data.results.map(pokemon => {
                axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemon.name).then(pokemonData => {
                    let about = pokemonData.data;
                    let pokemonObj;
                    pokemonObj = {
                        key: about.name,
                        name: about.name.toUpperCase(),
                        speed: about.stats[0].base_stat,
                        number: about.id,
                        spDefense: about.stats[1].base_stat,
                        spAttack: about.stats[2].base_stat,
                        defense: about.stats[3].base_stat,
                        attack: about.stats[4].base_stat,
                        hp: about.stats[5].base_stat
                    }
                    allData.push(pokemonObj);

                    if (allData.length === data.length) {
                        resolve(allData);
                    }
                })
            })
            

        })
    })

}



getData = (count) => {
    return new Promise((resolve, reject) => {
        let allData = new Array;
        var interval = {
            limit: count,
            offset: 10
        }
        P.getPokemonsList(interval)
            .then(function (response) {
                response.results.map(item => {
                    allData.push("/api/v2/pokemon/" + item.name);
                    if (allData.length === interval.limit) {
                        resolve(allData);
                    }
                })
            })
    })

}



app.get('/', async function (req, res) {

res.send("dsfasd");

});

app.use('/poke', async function (req, res) {

    getData(85).then(result => {
        P.resource(result)
    .then(function (response) {
        res.send(response); // resource function accepts singles or arrays of URLs/paths
    });
    })

//res.send(result);

});


app.listen(3000, function () {
    console.log('Приклад застосунку, який прослуховує 3000-ий порт!');
});