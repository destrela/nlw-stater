const express = require("express")
const server = express()

const db = require("./database/db")
// expor pasta public
server.use(express.static("public"))

// habilita o uso do req.body
server.use(express.urlencoded({ extended: true }))


const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
	express: server,
	nocache: true,
})


// rotas
server.get("/", (req, res) => {
	return res.render("index.html")
})

server.get("/create-point", (req, res) => {
	return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
	db.run(`
		CREATE TABLE IF NOT EXISTS places (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			image TEXT,
			name TEXT,
			address TEXT,
			address2 TEXT,
			state TEXT,
			city TEXT,
			items TEXT
		);
	`)

	const query =`
		INSERT INTO places (
			image,
			name,
			address,
			address2,
			state,
			city,
			items
		) VALUES (?,?,?,?,?,?,?)
	`

	const values =[
		req.body.image,
		req.body.name,
		req.body.address,
		req.body.address2,
		req.body.state,
		req.body.city,
		req.body.items
	]

	function afterInsertData(err) {
		if(err) {
			 console.log(err)
			return res.send("Erro no cadastro")
		}
		console.log("Cadastrado com sucesso")
		console.log(this)
		return res.render("create-point.html", {saved: true})
	}

	db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {

	const search = req.query.search

	db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
		if(err) {
			return console.log(err)
		}

		const total = rows.length

		return res.render("search-results.html", {places: rows, total: total})
	})

})
server.listen(3000)
