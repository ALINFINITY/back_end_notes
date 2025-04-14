const express = require("express");
const app = express();

//Importe del módulo CORS
const cors = require("cors");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const obj = {
  name: "Alan",
  status: "Aprendiendo Express",
};

//Middleware: Se utiliza el json-parser de express para tener disponible la propiedad body en la request}
app.use(express.json());

//Cors - Middleware
app.use(cors());

//Middleware:
const Midl_ShowProperties = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body || "not found");
  console.log("---------------------------");
  next();
};

//Utilización del middleware
app.use(Midl_ShowProperties);

//Controladores de ruta:

app.get("/", (request, response) => {
  response.send("<h2>Deployed!! 🔥</h2>");
});

//Endpoint para obtener todas las notas
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

//Endpoint para obtener una sola nota
app.get("/api/notes/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "Nota no encontrada";
    response.status(404).end();
  }
});

//Endpoint para obtener un objeto
app.get("/api/status", (request, response) => {
  response.json(obj);
});

//Endpoint para eliminar un objeto
app.delete("/api/notes/:id", (request, response) => {
  const id = parseInt(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  console.log(notes);

  response.status(204).end();
});

//Endpoint para registrar un objeto

const generateID = () => {
  const maxid = notes.length > 0 ? Math.max(...notes.map((not) => not.id)) : 0;
  return maxid + 1;
};

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note.content) {
    response.statusMessage = "Content missing";
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const newNote = {
    id: generateID(),
    content: note.content,
    important: Boolean(note.important) || false,
  };

  notes = [...notes, newNote];

  console.log(notes);
  //console.log(request.get("content-type"));

  response.json(newNote);
});

//Middleware: Si ningun controlador de ruta maneja una solicitud, lo hará el siguiente middleware
const endRoutes = (request, response) => {
  response.status(404).json({
    status: "Not Found Dude! try again...",
  });
};

app.use(endRoutes);

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
  console.log(`Server running on Port: ${Port}`);
});
