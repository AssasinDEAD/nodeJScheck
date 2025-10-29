const mySql = require('mysql2/promise')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const db = {
    host : "localhost",
    user : "root",
    password : "",
    database : "nodeTestDb"
}

// Тоже самое что и постгре


const pool = mySql.createPool(db)


async function checkTables() 
{


    // Делаем коннект с майскл тут уже авто инкремент надо писать так же а не сериал а то ошибка
    const con = await pool.getConnection()
    try{
        await con.query(`Create table if not exists users (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            username varchar(255), 
            age int,
            city varchar(255))`)
             await con.query(`Create table if not exists projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title varchar(255),
            budget int)`)
             await con.query(`Create table if not exists users_project (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id int,
            project_id int,
            Foreign key (user_id) references users(id) on delete cascade on update cascade,
            Foreign key (project_id) references projects(id) on delete cascade on update cascade)`)

            console.log("tables are ready!!!");
            
    }catch(err){
        console.log("There is a big problems", err);
    }finally{
        con.release()
    }    
}

checkTables()

// получение от нот фаунд, где ентити у нас будет выводится если у нас не будет этого элемента

function notFound(res, entity="item") {
    return res.status(404).json({error:`${entity} not found` })
    
}

function allIsGood(res, data) {
    return res.json(data)
    
}


// пул куери то есть майскл всегда возвращяет отчет о том что он сделал, и мы всегда можем использовать нужные нам параметры

// {
//   fieldCount: 0,
//   affectedRows: 0,
//   insertId: 0,
//   info: '',
//   serverStatus: 2,
//   warningStatus: 0
// }

app.post('/users', async (req, res)=>{
    try{
        const {name, age, city} = req.body
        if(!name){
            return res.status(400).json({error: `NAME IS REQUIRED`})
        }

        const [r] = await pool.query('insert into users (username, age, city) values (?, ?, ?)' , [name, age ?? null, city ?? null])
        allIsGood(res, {id: r.insertId, name, age, city})
    }
    catch(err){
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
        
    }

})

// тут используется трюк с вере, чтобы мы могли безопасно потом подставлять Энд даже если у нас пользователь не передал первый элемент, можем использовать 1=1 чтобы поставить вере, и выведет норм

app.get('/users', async (req, res)=>{
    try{
        const {minAge, city} = req.query
        const params = []
        const sql = "select * from users where 1=1"

        if(city){sql + "and city = ?" ; params.push(city)}
         if(minAge){sql + "and age = ?" ; params.push(minAge)}
        const [rows] = await pool.query(sql, params)
        allIsGood(res, rows)
    }
    catch(err){
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
        
    }
})

app.get('/users/:id', async (req, res)=>{
    try{
        const id = Number(req.params.id)
        const sql = "select * from users where id=?"
        const [rows] = await pool.query(sql, [id])
            if(id===0){
                console.log("not found");
                return notFound(res, "user")
            }
        allIsGood(res, rows[0])
    }
    catch(err){
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
})

app.get('/users/:id', async (req, res)=>{
    try{
        const id = Number(req.params.id)
        const sql = "select * from users where id=?"
        const [rows] = await pool.query(sql, [id])
            if(id===0){
                console.log("not found");
                return notFound(res, "user")
            }
        allIsGood(res, rows[0])
    }
    catch(err){
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
})
// COALESCE если результать не нулл то перезапищет, а если нул, то не тронет
app.put('/users/:id', async (req, res)=>{
    try{
        const id = Number(req.params.id)
        const {name, age, city} = req.body
        const [r] = await pool.query("update users set username = COALESCE(? , username),  age = COALESCE(? , age), city = COALESCE(? , city) where id = ?", [name ?? null, age ?? null, city ?? null, id])
        if(r.affectedRows === 0) return notFound(res, "User")
        const [rows] = await pool.query("Select * from users where id = ?", [id])
        allIsGood(res, [rows])
    }catch(err){
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
} )


app.delete("/users/:id", async (req, res)=>{
    try{
        const id = Number( req.params.id)
        const [r] = await pool.query("delete from users where id = ?", [id])
        if(r.affectedRows === 0)  return notFound(res, "user") ;
        allIsGood(res, id)
        
    }catch(err){
            console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
})


app.post("/projects", async (req, res)=>{
    try{
        const {title, budget} = req.body
        if (!title) return res.status(400).send({error: "Title is required"})
        const [r] = pool.query("Insert into projects (title, budget) values (?, ?)", [title, budget ?? null]) 
        allIsGood(res, {id: r.insertId, title, budget})
    }catch(err){
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
})

app.get("/projects", async (req, res)=>{
    try {
        const minBudget = req.query
        let sql = "select * from projects where 1=1"
        const params=[]
        if(minBudget){sql += "and budget >= ?"; params.push(Number(minBudget))}
        const [row]= await pool.query(sql, params)
        allIsGood(res, row)
    } catch (err){
           console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
})
app.get("/projects/:id", async (req,res)=>{
    try {
        const id = Number(req.params.id)
        const [row] =await pool.query( "select * from projects where id =?", [id])
        if (row.length===0){return notFound(res, "Project")}
        allIsGood(res, row[0])
          
    } catch (err) {
        console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) });
    }
})

app.put("/projects/:id", async (req, res)=> {
    try {
        const id = Number(req.params.id)
        const {title, budget} = req.body
        const [r] = await pool.query("update projects set title = COALESCE(?, title), budget = COALESCE(?, title) where id = ?", [title ?? null, budget ?? null, id])
        if(r.affectedRows === 0) return notFound(res, "Project")
        const [row] = await pool.query("select * from projects where id = ?", [id])
        allIsGood(res, row[0])
    } catch (err) {
            console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) }); 
    }
})

app.delete("/projects/:id", async (req,res)=>{
    try {
            const id = Number(req.params.id)
    const [row] = await pool.query("delete from projects where id = ?", [id])
    if(row.affectedRows===0) notFound(res, "Projects")
    allIsGood(res, id)
    } catch (err) {
            console.log("Errors with data", err);
        return res.status(500).json({ error: "Internal error", details: err.sqlMessage || String(err) }); 
    }

})

app.listen(PORT, ()=> {
    console.log("Port 3000 is ready http://localhost:3000" );
})

