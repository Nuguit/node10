const express = require('express');
const app = express();
const libros = require('./routes/libros')
let {MongoClient} = require('mongodb')
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function connectMongo() {
    try {
        await client.connect().then((client) => app.locals.db = client.db('prueba'));
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB está conectado");
    } catch (error) {
        console.error("MongoDB no conectado:", error);
    }
}

connectMongo()




app.get('/mongodonalds/:menus', (req, res) => {
    res.json(productos.menus);
});

app.get('/mongodonalds/:hamburguesas', (req, res) => {
    res.json(productos.hamburguesas);
});

app.get('/mongodonalds/:bebidas', (req, res) => {
    res.json(productos.bebidas);
});


app.post('/mongodonalds/:tupedido', (req, res) => {
    const tupedido = req.body;
});


app.put('/mongodonalds/:nuevopedido', (req, res) => {
    const nuevoPedido = req.body;
    });

function mostrarProductos(tipo) {
    const select = document.getElementById('productos');
    select.innerHTML = ''; 
    productos[tipo].forEach(producto => {
        const option = document.createElement('option');
        option.text = `${producto.nombre} - ${producto.precio}€`;
        option.value = producto.nombre;
        select.add(option);
    });
}


function mostrarProductos(tipo) {
    const select = document.getElementById('productosSelect');
    select.innerHTML = ''; 

    
    switch (tipo) {
        case 'menus':
            
            const bebida = document.createElement('select');
            bebida.id = 'bebida';
            productos.bebida.forEach(bebida => {
                const option = document.createElement('option');
                option.text = `${bebida.nombre} - ${bebida.precio}€`;
                option.value = bebida.nombre;
                bebida.add(option);
            });
            select.appendChild(bebida);
            
            
            const patatas = document.createElement('option');
            patatas.text = 'Patatas';
            patatas.value = 'Patatas';
            select.add(patatas);
            break;

        case 'hamburguesas':
            
            const patatasConHamburguesa = document.createElement('option');
            patatasConHamburguesa.text = 'Patatas';
            patatasConHamburguesa.value = 'Patatas';
            select.add(patatasConHamburguesa);
            break;

        case 'bebidas':
                productos.bebida.forEach(bebida => {
                const option = document.createElement('option');
                option.text = `${bebida.nombre} - ${bebida.precio}€`;
                option.value = bebida.nombre;
                select.add(option);
            });
            break;

        default:
            break;
    }}


let pedidoActual = "";



function editarPedido() {
    if (pedidoActual) {
        mostrarProductos(pedidoActual.tipo);
    }
}

function mostrarPedidoCompleto() {
   let precioTotal = 0;
    pedidoActual.productos.forEach(producto => {
        precioTotal += producto.precio;
    });

    alert(`Pedido completo:\n${pedidoActual.productos.map(producto => producto.nombre).join('\n')}\n\n Precio Total: ${precioTotal}€`);
}

function finalizarPedido() {
    const confirmacion = confirm("¿Estás seguro de que quieres finalizar tu pedido?");

    if (confirmacion) {
       mostrarPedidoCompleto();
    } else {
         editarPedido();
    }
}



document.getElementById('terminar').addEventListener('click', finalizarPedido);


document.getElementById('enviarPedido').addEventListener('click', function(event) {
    event.preventDefault();
    const selectedProduct = document.getElementById('productos').value;
   
    pedidoActual = {
        tipo: tipoSeleccionado,
        productos: [selectedProduct]
    };
    enviarPedido(pedidoActual);
});




app.listen(PORT, (e) => {
    e
        ? console.error("Express no conectado")
        : console.log("Express conectado y a la escucha en el puerto: " + PORT)
})