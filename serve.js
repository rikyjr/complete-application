const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(bodyParser.json());

let users = [
      { 
        id:1,
        username: 'rafa@rafa.com',
        email: 'rafa@rafa.com',
        password: '$2a$08$2BF5EnTVSgANgarwnFWf7.U5CJqiKJMEfsJGRJYzdNBhGVjFzMqye'
    }
];  // Aquí se almacenarán los usuarios (solo para propósitos de demostración)

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(402).send({ message: 'sin token' });
    }
   next();
};

// Registro de usuario
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    users.push({
        id: users.length + 1,
        username,
        email,
        password: hashedPassword
    });
   // console.log(users)

    res.send({ message: 'Usuario registrado exitosamente' });
});

// Login de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.email === username);
    if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: 86400 // 24 horas
    });

    res.send({ token });
});

// Deslogueo de usuario
app.post('/logout', (req, res) => {
    // En este caso, desloguear solo requiere que el cliente elimine el token
    res.send({ message: 'Deslogueado exitosamente' });
});

// Obtener productos (solo para usuarios autenticados)
app.get('/products', verifyToken, (req, res) => {
    const products = [
        { id: 1, name: 'Producto 1', price: 100, image: 'https://off.com.ph/-/media/images/off/ph/products-en/update-983/plp/overtime-group-plp.png'},
        { id: 2, name: 'Producto 2', price: 200, image: 'https://off.com.ph/-/media/images/off/ph/products-en/update-983/plp/kids-group-pdp.png'},
        { id: 3, name: 'Producto 3', price: 300, image: 'https://off.com.ph/-/media/images/off/ph/products-en/update-983/plp/baby-group-plp.png'}
    ];
    res.send(products);
});

app.get('/products/:id', verifyToken, (req, res) => {
    const productId = parseInt(req.params.id);
   const products = [
        { id: 1, name: 'Producto 1', price: 100, image: 'https://off.com.ph/-/media/images/off/ph/products-en/update-983/plp/overtime-group-plp.png'},
        { id: 2, name: 'Producto 2', price: 200, image: 'https://off.com.ph/-/media/images/off/ph/products-en/update-983/plp/kids-group-pdp.png'},
        { id: 3, name: 'Producto 3', price: 300, image: 'https://off.com.ph/-/media/images/off/ph/products-en/update-983/plp/baby-group-plp.png'}
    ];

    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).send({ message: 'Producto no encontrado' });
    }

    res.send(product);
});

app.post('/contact', async (req, res) => {
    const { email, subject, msg } = req.body;

    res.send({ message: 'El mensaje fue enviado exitosamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
