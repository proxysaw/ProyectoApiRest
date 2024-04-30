import express from "express";
import fs, { write } from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (err) {
        console.error(err);
    }
};

app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get("/", (req, res) => {
    readData();
    res.send("Bienvenido a mi primera API con node js!");
});

app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
});

app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
      id: data.books.length + 1,  
      ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        res.status(404).json({ message: "Libro no encontrado" });
    } else {
        data.books[bookIndex] = {
            ...data.books[bookIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Libro actualizado correctamente" });
    }
});

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: "Libro eliminado correctamente" });
});

app.listen(3000, () => {
 console.log('Server is running on port 3000');
});