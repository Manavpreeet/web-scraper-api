import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cron from 'node-cron'
import itemRouter from './routes/item.js'
import dotenv from 'dotenv'
import * as brain from './brain/index.js'


dotenv.config()

const app = express()

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())

app.use('/items', itemRouter)

app.get("/", (req, res) => {
    res.send("Hello to items API")
})

const DATABASE_URL = process.env['MONGO_URL']
const PORT = process.env.PORT || 5000
var isThereError = true

cron.schedule("0 */12 * * * ", () => {
    if(!isThereError) {
        console.log("Heelo cron")
        brain.priceComparisonAndMailSender()
    }else {
        console.log("Cron job is running but there is an error")
    }
})



mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(app.listen(PORT, () => {
        isThereError = false
        console.log(`Server is running at port: ${PORT}`)}))
    .catch(error => {
        isThereError = true
        console.log(error.message)})