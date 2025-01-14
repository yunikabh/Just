import 'dotenv/config';
import connectDb from './db/mongoose.connection.js';
import app from "./app.js";


const port =process.env.PORT

connectDb().then(()=>{
    app.listen(port,()=>{
        console.log(`Server started at http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log("error in connecting", port);
})



