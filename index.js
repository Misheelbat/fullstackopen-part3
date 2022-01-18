const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const Person = require("./models/person");

// all middleware
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

// get all persons
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((err) => next(err));
});

// get total number of entry in the phonebook
app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>
    `);
  });
});

// get single person entry
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(error));
});

// delete from persons
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

// create new person
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (Object.keys(body).length === 0) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  /* if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }else if (persons.some((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((err) => next(err));
});

//update phonebook number
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((err) => next(err));
});

//error handler middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
