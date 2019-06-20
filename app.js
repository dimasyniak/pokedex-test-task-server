const express = require('express');
const axios = require('axios');
const app = express();
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*getData = () => {
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

}*/



getData = (count) => {
    return new Promise((resolve, reject) => {
        let allData = new Array;
        var interval = {
            limit: 20,
            offset: count
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



app.get('/',  function (req, res) {

res.send("dsfasd");

});

app.post('/poke',  function (req, res) {

    /*getData(50).then(result => {
        P.resource(result)
    .then(function (response) {
        res.send(response); // resource function accepts singles or arrays of URLs/paths
    });
    })*/
    res.send(req.body.name);

//res.send(result);

});

app.post('/test',  function (req, res) {

   //var id = req.body.id;
   //res.send(JSON.stringify('send: '+ id*2))
    //console.log(Number(req.body.id));
    //res.send(req.body.id);
   
   getData(Number(req.body.id)).then(result => {
        P.resource(result)
    .then(function (response) {
        res.status(200).send(response); // resource function accepts singles or arrays of URLs/paths
    });
    })

   
  /* getData(JSON.stringify(id)).then(result => {
        P.resource(result)
    .then(function (response) {
        res.send(response); // resource function accepts singles or arrays of URLs/paths
    });
    })*/

});


app.listen(3000, function () {
    console.log('Приклад застосунку, який прослуховує 3000-ий порт!');
});