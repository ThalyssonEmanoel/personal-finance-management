import "dotenv/config";
import app from "./src/app.js";

const port = process.env.PORT || 8080;

app.listen(port, ()=>{
  console.log(`FUNCIONOU, ESTÁ RODANDO NA PORTA: http://localhost:${port}`);
  console.log(`PORTA DO BANCO: http://localhost:5001`);
})
