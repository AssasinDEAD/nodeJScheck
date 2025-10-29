const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

let users = [
   {id: 1, name: "John Doe"},
   {id: 2, name: "Jane Smith"},
   {id: 3, name: "Alice Johnson"}   
]

app.get("/hello", (req, res)=>{
   res.status(200).send("hello world!")
})

app.post("/data", (req, res)=>{
   res.status(200).send("Received data with POST method")
})


app.put("/users/:id", (req, res)=>{
   async function updateData() {
      try{
         const userId = parseInt(req.params.id)
         const updatedData = req.body
         const userIndex = users.findIndex(user=> user.id === userId)

         if(userIndex !== -1){
            users[userIndex] = await {...users[userIndex], ...updatedData}
            res.status(200).send("User updated successfully")
         }
      }
      catch(err){
         res.status(500).send("Update error", err.message)
      }
   }

   updateData()
})
app.delete("/users/:id", (req, res)=>{
   function deleteData() {
   try{
      const {id} = req.params
      users = users.filter(user=> user.id !== parseInt(id))
      res.status(200).send("User deleted successfully")

   }
   catch(err){
      res.status(500).send("Delete error", err.message)
   }
  }
  deleteData()
})



app.listen(PORT,()=>{

   console.log("Listening server", PORT);
   
})