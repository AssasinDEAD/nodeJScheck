const pool = require("./db")
const express = require("express")
const app = express()

app.use(app.json())
const PORT = process.env.PORT || 3000

async function tableExists() {
   await pool.query(`create table if not exists tasks(
      id serial primary key,
      title varchar(255) not null,
      completed boolean default false);`)
}

app.get("/tasks", async (req, res) => {
   const tasks = await pool.query("select * from tasks")
   res.json(tasks.rows)

})