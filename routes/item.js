import express from 'express'
import {getItems, createNewItem, deleteItem } from '../controller/item.js'

const router = express.Router()

router.get("/", getItems)
router.post("/", createNewItem)
router.delete("/:id", deleteItem)

export default router