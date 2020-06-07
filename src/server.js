const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db");


// configurar pasta publica
server.use(express.static("public"));

// habilitar o request.body da nossa aplicação
server.use(express.urlencoded({ extended: true }));


// utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});

// configurar caminhos da minha aplicação
// página inicial
server.get("/", (request, response) => {
    return response.render("index.html");
});

server.get("/create-point", (request, response) => {
    return response.render("create-point.html");
});

server.post("/savepoint", (request, response) => {

        // Inserir dados na tabela
    const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
            ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        request.body.image,
        request.body.name,
        request.body.address,
        request.body.address2,
        request.body.state,
        request.body.city,
        request.body.items
    ];

    function afterInsertData(err) {
        if(err) {
            console.log(err);
            return response.send("Erro no cadastro!")
        }

        console.log("Cadastro com sucesso!");
        console.log(this);

        return response.render("create-point.html", { saved: true });
    };

    db.run(query, values, afterInsertData)

});



server.get("/search", (request, response) => {
    const search = request.query.search;

    if(search == "") {
        // pesquisa vazia
        return response.render("search-results.html", { total: 0 });
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err);
        }

        const total = rows.length;

        // mostrar a página html com os dados do banco de dados
        return response.render("search-results.html", { places: rows, total });
    })

});

// ligar o servidor
server.listen(3000, () => {
    console.log("Server is running ...");
});