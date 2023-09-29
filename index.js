import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

const app = express()

const expossedPort = 1234


app.get("/", (req, res) => {
    console.log("Request recibida")
    res.status(200).send("<h1>WELCOME</h1>")
})

/* Busco los usuarios completos */
app.get("/usuarios", (req, res) => {
    const users = datos.usuarios
    res.status(200).json(users)
})

/* busco por ID un usuario */
app.get("/usuarios/:id", (req, res) => {
    const userID = +req.params.id;
    const user = datos.usuarios.find(usuario => usuario.id === userID);
    if (!user) {
        return res.status(404).send("Usuario no encontrado");
    }
    res.json(user);
})


/* Creo un usuario nuevo */
app.post('/usuarios', (req, res) => {
    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        try {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.usuario.push(req.body)

            res.status(201).json({"message": "success"})
        } catch (error) {
            res.status(500).json({"message": "error"})
        }
    })
})


/* Modificacion de usuraio */

app.patch('/usuarios/:id', (req, res) => {
    let iduserAEditar = parseInt(req.params.id)
    let userAActualizar = datos.usuarios.find((usuario) => usuario.id === iduserAEditar)

    if (!userAActualizar) {
        return res.status(204).json({"message": "Usuario no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        if(data.nombre){
            userAActualizar.nombre = data.nombre
        }
        
        if (data.edad){
            userAActualizar.edad = data.edad
        }

        if (data.email){
            userAActualizar.email = data.email
        }

        res.status(200).send('Usuario actualizado')
    })
})


/* Borrar un usuario */
app.delete('/usuarios/:id', (req, res) => {
    let idusuarioABorrar = parseInt(req.params.id)
    let usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idusuarioABorrar)

    if (!usuarioABorrar){
        res.status(204).json({"message":"usuario no encontrado"})
    }

    let indiceusuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)
    try {
         datos.usuarios.splice(indiceusuarioABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* Precio de un producto por su ID */
app.get("/productos/:id", (req, res) => {
    const productoID = +req.params.id;
    const producto = datos.productos.find(producto => producto.id === productoID);
    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }
    res.json({ precio: producto.precio });
})


/* Muestra el nombre del producto segun su id */
app.get("/productos/:id/nombre", (req, res) => {
    const productId = parseInt(req.params.id);

    // Busca el nombre por ID en la lista de productos
    const product = datos.productos.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Nombre no encontrado' });
    }

    // Devuelve solo el nombre del producto
    res.json({ nombre: product.nombre });
});


/* Muestra el telefono del usuario segun ID */

app.get("/usuarios/:id/telefono", (req, res) => {
    const UId = parseInt(req.params.id);

    // Busca el numero por ID en la lista de usuarios
    const User1 = datos.usuarios.find(U => U.id === UId);

    if (!User1) {
        return res.status(404).json({ error: 'Telefono no encontrado' });
    }

    // Devuelve solo el numero del usuario
    res.json({ telefono: User1.telefono });
});


/* Muestra el nombre del usuario segun su id */
app.get("/usuarios/:id/nombre", (req, res) => {
    const NId = parseInt(req.params.id);

    // Busca el nombre por ID en la lista de usuarios
    const name = datos.usuarios.find(N => N.id === NId);

    if (!name) {
        return res.status(404).json({ error: 'Nombre no encontrado' });
    }

    // Devuelve solo el nombre del usuario
    res.json({ nombre: name.nombre });
});


/* Precio total */

app.get('/precio-total', (req, res) => {
    try {
      // Obtiene la lista de productos desde los datos cargados
      const productos = datos.productos;
  
      // Calcula el total de los precios de todos los productos
      const total = productos.reduce((accumulator, product) => {
        return accumulator + product.precio;
      }, 0);
  
      res.json({ total });
    } catch (error) {
      console.error('Error al calcular el precio total:', error);
      res.status(500).json({ error: 'Se produjo un error al calcular el precio total' });
    }
  });
  


/* Muestra un mensaje de error 404 si no procesa la solicitud */
app.use((req, res) => {
    res.status(404).send("404")
})

app.listen(expossedPort, () => {
    console.log("Servidor escuchando en http://localhost: ", + expossedPort)
})