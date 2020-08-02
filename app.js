const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
//const Joi = require('joi'); //used for validation
const { json } = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dataPath = "C:/Users/Dhimam/Desktop/REST/db/data.json";

//READ Request Handlers
app.get('/', (req, res) => {
    res.send('<h2 align="center" style="font-family:verdana">server is connected!</h2>');
});

app.get('/api/books', (req, res) => {
    fs.readFile(dataPath, "UTF8", (err, fileContents) => {
        if (err) {
            console.error(err)
            return
        }
        const data = JSON.parse(fileContents)
        console.log(data)
        res.send(data)

    })
});


app.get('/api/books/:id', (req, res) => {

    const dataBuffer = fs.readFileSync(dataPath)
    const data1 = JSON.parse(dataBuffer)
    const book = data1.find(c => c.id == req.params.id);
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    res.send(book);
});


//Post Request
app.post('/api/books', (req, res) => {
    const dataBuffer = fs.readFileSync(dataPath)
    const data1 = JSON.parse(dataBuffer)
    console.log(data1)
    let len = parseInt(data1[data1.length - 1].id) + 1
    const data = {
        "id": len,
        "title": req.body.title
    }
    data1.push(data)
    fs.writeFileSync(dataPath, JSON.stringify(data1))
    res.send(JSON.stringify(data1) + "\nSaved")

});

//UPDATE Request Handler
app.put('/api/books/:id', (req, res) => {
    
	const dataBuffer = fs.readFileSync(dataPath)
    const data1 = JSON.parse(dataBuffer)
    const book = data1.find(c => c.id == req.params.id)
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');
    book.title=req.body.title
    fs.writeFileSync(dataPath, JSON.stringify(data1))
    res.send(data1)
    
});

//DELETE Request Handler
app.delete('/api/books/:id', (req, res) => {

    const dataBuffer = fs.readFileSync(dataPath)
    const data1 = JSON.parse(dataBuffer)
    const book = data1.find(c => c.id == req.params.id);
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');
    const index = data1.indexOf(book);
    data1.splice(index, index+1);
    fs.writeFileSync(dataPath, JSON.stringify(data1))
    res.send(data1);
});




//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port~ ${port}..`));