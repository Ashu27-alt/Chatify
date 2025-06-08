import server from "./app.js"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js";

dotenv.config({ path: "src/.env", override: true })

const port = process.env.PORT || 3000

connectDB()
.then(()=>{
    server.listen(port, () => {
        console.log(`Server is listening on Port ${port}`)
    })
})
.catch(err=>{
    console.log("Connection error:",err );
})
    