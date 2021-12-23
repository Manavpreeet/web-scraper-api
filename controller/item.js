import mongoose from 'mongoose'
import Item from '../model/item.js'
import { fetchURL } from '../brain/index.js'

export const getItems = async (req, res) => {
    try {
        const items = await Item.find()
        res.status(200).json({items})
    }catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}

export const createNewItem = async (req, res) => {
    
    try {
        const data = req.body
        const recivedData = await fetchURL(data.url)
        console.log(recivedData)
        const item = {...req.body, ...recivedData}
        const newItem = new Item(item)

        await newItem.save()
        console.log(newItem)    
        res.status(200).json({...item, message: "Data saved succesfully"})
    }catch (e) {
        res.status(401).json(e)
    }
}

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(401).send(`No item found with id: ${id}`)

        await Item.findByIdAndRemove(id)

        res.status(201).json({message: "Post was deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }
}