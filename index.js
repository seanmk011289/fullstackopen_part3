const express = require("express");
const morgan = require("morgan");
const app = express();

// Don't forget this middleware to format request info as json in the request.body
app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

// morgan.token("body", function (req, res) {
//   return JSON.stringify(req.body);
// });

app.use(morgan(":method :url :response-time :body"));

let listings = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(listings);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const p = listings.find((listing) => listing.id === id);
  if (p) {
    response.json(p);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  let n = listings.length;
  let date = new Date();
  response.send(
    `<p>Phonebook has info for ${n} people.</p>
    <p>${date}</p>`
  );
});

// Generating random ID
const randomID = () => {
  return Math.floor(Math.random() * 100000000);
};

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  // Checking to see that request body has data
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Enter both the name and number of the new listing",
    });
  }
  // Checking if name already exists in phonebook
  if (
    listings.some(
      (listing) => listing.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error:
        "The name you entered already exists in the phonebook. Please enter a different name.",
    });
  }

  const newListing = {
    id: randomID(),
    name: body.name,
    number: body.number,
  };

  listings = listings.concat(newListing);

  response.json(newListing);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  listings = listings.filter((listing) => listing.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
