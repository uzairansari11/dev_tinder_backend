/* Importing modules */
const express = require("express");

/* Instance of express js application */
const app = express()




/* Defining port */

const PORT =3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
