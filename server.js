const express = require('express')
const { Router } = express
const Contenedor = require("./contenedor");
const contenedor = new Contenedor('./productos.json')
const contenedor2 = new Contenedor('./carrito.json')
const handlebars = require('express-handlebars');


const app = express()
const routerProductos = Router()
const routerCarrito = Router()

app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

const administrador = false

const arrayProductos = []
///-Productos-///
routerProductos.get('/', async (req, res) => {
    const productos = await contenedor.getProductos()
    res.render('list',{ listExist:true, list:productos}) 
})

routerProductos.get('/', async (req, res) => {
    const productos = await contenedor.getProductos()
    res.render('index', {formulario: productos}) 
})

routerProductos.get('/:id', async (req, res) => {
    const {id} = req.params
    const elegido = await contenedor.getId(id)
    if(elegido){
     res.json({elegido})
    }else{
        return {error:'No existe'}
    }
 })
//Agrega un producto al listado
routerProductos.post('/', async (req, res) => {
    const {title,price,thumbnail,description,stock} = req.body
    const producto = {title,price,thumbnail,description,stock}
    const agregado = await contenedor.postProducto(producto)
    res.render('index',{ listExist:true, list:contenedor}) 
})
//Actualiza producto
routerProductos.put('/:id', (req, res) => {
    const {id} = req.params
    const {title,price,thumbnail,description,stock} = req.body
    const obj = {id,title,price,thumbnail,description,stock}
    const actualizado = contenedor.updateById(obj)
    res.json({
        actualizado
    })
})

routerProductos.delete('/:id',async (req, res) => {
    const {id} = req.params
    const borrado = await contenedor.deleteById(id)   
    res.json({
           borrado
        })
})



app.use('/productos', routerProductos)

const arrayCarrito = []
//traer todo lo que hay un carrito
routerCarrito.get('/', async (req, res) => {
    const agregado = await contenedor2.getCarrito()
    res.render('carrito',{ carritoNuevoExist:true, carritoNuevo:agregado}) 
})
//traer el contenido de un carrito determinado
routerCarrito.get('/:id_carrito/productos', async (req, res) => {
    const {id_carrito} = req.params
    const productos = await contenedor2.getCarrito(id_carrito)
    if(productos){
     res.json({productos})
    }else{
        return {error:'No existe'}
    }
 })
//Agregar un producto a un carrito determinado
 routerCarrito.post('/:id_carrito/productos/:id', async (req, res) => {
    const {id_carrito, id} = req.params
    const agregado = await contenedor2.agregarCarrito(id_carrito, id)
    res.render('carrito',{ carritoNuevoExist:true, carritoNuevo:contenedor2}) 
})
//creacion de carritos
routerCarrito.post('/', async (req, res) => {
    const agregado = await contenedor2.postCarrito()
    res.render('carrito',{ carritoNuevoExist:true, carritoNuevo:contenedor2}) 
})

//borrado de carritos
routerCarrito.delete('/:id_carrito',async (req, res) => {
    const {id_carrito} = req.params
    const borrado = await contenedor2.deleteCarrito(id_carrito)   
    res.json({
           borrado
        })
})
//borrado de productos dentro de carritos
routerCarrito.delete('/:id_carrito/productos/:id',async (req, res) => {
    const {id_carrito,id} = req.params
    const borrado = await contenedor.deleteCarritoID(id_carrito,id)   
    res.json({
           borrado
        })
})
//ruta carrito
app.use('/carrito', routerCarrito)

//carrito?
//carrito

const server = app.listen(8080, () =>{
    console.log(server.address().port)
})

server.on('error', err => console.log(err))