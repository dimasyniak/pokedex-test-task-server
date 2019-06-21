const express = require('express');
const axios = require('axios');
const app = express();
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



getData = (offset, limit = 10) => {
    return new Promise((resolve, reject) => {
        let allData = new Array;
        var interval = {
            limit: limit,
            offset: offset
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



app.get('/', function (req, res) {

    res.send("dsfasd");

});



app.post('/all', function (req, res) {

    getData(Number(req.body.offset), Number(req.body.limit)).then(result => {
        P.resource(result)
            .then(function (response) {
                res.status(200).send(response); // resource function accepts singles or arrays of URLs/paths
            });
    })

});

app.post('/types', function (req, res) {
    // res.status(200).send(req.body);
    let allTypes = new Array;
    let limit = Number(req.body.limit);
    let offset = Number(req.body.offset);

    let data = {
        pokemons: null,
        count: null
    }
    req.body.types.map(item => {
        allTypes.push('/api/v2/type/' + item);
    })
    P.resource(allTypes)
    .then(function(response) {
        let allData = new Array;
        response.map(item => {
            item.pokemon.map(pokeItem => {
                allData.push('/api/v2/pokemon/' + pokeItem.pokemon.name);
            })
        })
        P.resource(Array.from(new Set(allData.slice(offset, limit+offset))))
        .then(function(response) {
            data = {
                pokemons: Array.from(new Set(allData.slice(offset, limit+offset))),
                count: Array.from(new Set(allData)).length
            }
            res.status(200).send(data); // resource function accepts singles or arrays of URLs/paths
        });
        // res.status(200).send(Array.from(new Set(allData.slice(20, 40)))); // resource function accepts singles or arrays of URLs/paths
    });
});




app.listen(3000, function () {
    console.log('Приклад застосунку, який прослуховує 3000-ий порт!');
});