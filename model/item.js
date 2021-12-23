import mongoose from 'mongoose'

const itemSchema = mongoose.Schema({
    title: String,
    url: String,
    emailId: String,
    expectedPrice: Number,
    price: Number,
    imgSrc: String
})

const Item = mongoose.model('Item', itemSchema)

export default Item