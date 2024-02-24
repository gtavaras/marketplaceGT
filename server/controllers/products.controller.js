import Products from '../models/products.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

//create new product
const create = async (req, res) => { 
const products = new Products(req.body) 
try {
await products.save()
return res.status(200).json({ 
message: "Successfully signed up!"
})
} catch (err) {
return res.status(400).json({
error: errorHandler.getErrorMessage(err) 
})
} 
}

//list all products or by filter
const list = async (req, res) => {
try {
    let query = {};
    if (req.query.name) {
      query.name = { $regex: new RegExp(req.query.name, 'i') };
    }

    let products = await Products.find(query).select('name description price quantity category');
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
} 
}

//search product by Id
const productByID = async (req, res, next, id) => { 
try {
let products = await Products.findById(id) 
if (!products)
return res.status('400').json({ 
error: "Product not found"
})
req.profile = products 
next()
} catch (err) {
return res.status('400').json({ 
error: "Could not retrieve product"
}) 
}
}

const read = (req, res) => {
    return res.json(req.profile) 
}

//update
const update = async (req, res) => { 
try {
let products = req.profile
products = extend(products, req.body) 
products.updated = Date.now() 
await products.save()
res.json(products) 
} catch (err) {
return res.status(400).json({
error: errorHandler.getErrorMessage(err) 
})
} 
}

//remove
const remove = async (req, res) => { 
try {
let products = req.profile
let deletedProduct = await products.deleteOne() 
res.json(deletedProduct) 
} catch (err) {
return res.status(400).json({
error: errorHandler.getErrorMessage(err) 
})
} 
}

//remove all
const removeAll = async (req, res) => {
try
{
    await Products.deleteMany({})

    return res.status(200).json({ 
        message: "All products have been deleted successfully."
    })
}
catch (err)
{
    return res.status(400).json({
    error: errorHandler.getErrorMessage(err)
})
}
}

export default { create, productByID, read, list, remove, update, removeAll }

