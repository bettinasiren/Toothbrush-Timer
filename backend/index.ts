import express from 'express';


const port = 3000

const app = express()



app.get("/", (_request, response) => {
  response.send("Hej från backend")
})


app.listen(port, () => {
  console.log(`Redo på Port http://localhost:${port}/`);
  });
