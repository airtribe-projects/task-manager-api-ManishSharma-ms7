const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasks = JSON.parse(fs.readFileSync(`${__dirname}/task.json`));

app.get("/tasks", (req, res) => {
	var result = {};
	result["status"] = "success";
	result["count"] = tasks["tasks"].length;
	result["data"] = tasks["tasks"];
	res.status(200).json(result);
});

app.get("/tasks/:id", (req, res) => {
	let found = -1;
	var result = {};
	result["status"] = "success";
	result["data"] = [];
	for (let i = 0; i < tasks["tasks"].length; i++) {
		if (tasks["tasks"][i]["id"] === parseInt(req.params.id)) {
			found = i;
			break;
		}
	}
	if (found >= 0) {
		result["data"].push(tasks["tasks"][found]);
		result["count"] = result["data"].length;
		res.status(200).json(result);
	} else {
		res.status(400).json("Not found");
	}
});

app.post("/tasks", (req, res) => {
	if (!req.body.hasOwnProperty("title")) {
		res.status(400).send("Invalid request");
	} else if (typeof req.body.title !== "string") {
		res.status(400).send("Invalid request");
	} else if (req.body.title.length === 0) {
		res.status(400).send("Invalid request");
	} else if (!req.body.hasOwnProperty("description")) {
		res.status(400).send("Invalid request");
	} else if (typeof req.body.description !== "string") {
		res.status(400).send("Invalid request");
	} else if (req.body.description.length === 0) {
		res.status(400).send("Invalid request");
	} else if (!req.body.hasOwnProperty("completed")) {
		res.status(400).send("Invalid request");
	} else if (typeof req.body.completed != "boolean") {
		res.status(400).send("Invalid request");
	} else {
		var result = {};
		result["status"] = "success";
		result["data"] = [];
		// req.body.id = tasks["tasks"].length + 1;
		tasks["tasks"].push({ id: tasks["tasks"].length + 1, ...req.body });
		fs.writeFile(`${__dirname}/task.json`, JSON.stringify(tasks), (err) => {
			result["data"] = tasks["tasks"];
			result["count"] = tasks["tasks"].length;
			res.status(201).json(result);
		});
	}
});

app.put("/tasks/:id", (req, res) => {
	let found = -1;
	var result = {};
	result["status"] = "success";
	result["data"] = [];
	if (req.body.hasOwnProperty("title") || req.body.hasOwnProperty("description") || req.body.hasOwnProperty("completed")) {
	} else {
		res.status(400).send("Invalid request params");
	}
	for (let i = 0; i < tasks["tasks"].length; i++) {
		if (tasks["tasks"][i]["id"] === parseInt(req.params.id)) {
			found = i;
			break;
		}
	}
	if (found >= 0) {
		let value = req.body;
		tasks["tasks"][found] = { ...tasks["tasks"][found], ...value };
		result["data"] = tasks["tasks"];
		result["count"] = result["data"].length;
		fs.writeFile(`${__dirname}/task.json`, JSON.stringify(tasks), (err) => {
			result["data"] = tasks["tasks"];
			result["count"] = tasks["tasks"].length;
			res.status(201).json(result);
		});
	} else {
		res.status(404).json("Not found");
	}
});

app.delete("/tasks/:id", (req, res) => {
	let found = -1;
	var result = {};
	result["status"] = "success";
	result["data"] = [];
	for (let i = 0; i < tasks["tasks"].length; i++) {
		if (tasks["tasks"][i]["id"] === parseInt(req.params.id)) {
			found = i;
			continue;
		}
		result["data"].push(tasks["tasks"][i]);
	}
	if (found >= 0) {
		fs.writeFile(`${__dirname}/task.json`, JSON.stringify({ tasks: result["data"] }), (err) => {
			result["data"] = result["data"];
			result["count"] = result["data"].length;
			res.status(201).json(result);
		});
	} else {
		res.status(400).json("Not found");
	}
});

app.listen(port, (err) => {
	if (err) {
		return console.log("Something bad happened", err);
	}
	console.log(`Server is listening on ${port}`);
});

module.exports = app;
