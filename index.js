require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const Person = require("./models/Person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/info", (request, response) => {
  let date_ob = new Date();
  let personsLength;
  Person.find({}).then((persons) => {
    personsLength = persons.length;
    response.send(
      `<h1>Phonebook has info for ${personsLength} people</h1> <h1>${date_ob}</h1>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));

  response.status(204).end();
});

app.put("/api/persons/:id", (request, response, next) => {
  const requestBody = request.body;

  const newPerson = {
    name: requestBody.name,
    number: requestBody.number,
  };

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});