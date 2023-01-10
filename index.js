require('dotenv').config()
const cors = require("cors");
const express = require("express");
const app = express();
const Person = require('./models/Person')

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/info", (request, response) => {
  let date_ob = new Date();
  response.send(
    `<h1>Phonebook has info for ${persons.length} people</h1> <h1>${date_ob}</h1>`
  ); 
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // const isNameUnique = persons.every((person) => person.name != body.name);

  // if (!isNameUnique) {
  //   return response.status(400).json({ error: "name is already taken" });
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((person) => response.json(person));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
