const express = require('express');
const app = express();
const ProductManager = require('../src/ProductManager'); // Asegúrate de proporcionar la ruta correcta al archivo de ProductManager

const manager = new ProductManager('productos.json'); // Asegúrate de que el archivo 'productos.json' exista en la misma ubicación.

// Middleware para el análisis de JSON en las solicitudes
app.use(express.json());
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la aplicación de gestión de productos!');
});
// Ruta para obtener un producto por ID
app.get('/api/products', async (req, res) => {
    try {
      await manager.loadProducts(); // Cargar productos con await
      const products = manager.getProducts();

      // Verificar si se proporcionó un valor de límite en el query parameter
      const limit = parseInt(req.query.limit);

      if (isNaN(limit) || limit <= 0) {
        // Si no se proporciona o es inválido, devolver todos los productos
        res.json(products);
      } else {
        // Si se proporciona un límite válido, devolver solo el número de productos solicitados
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
      }

    } catch (error) {
      res.status(500).json({ error: 'Error al cargar productos' });
    }
  });

  // Ruta para obtener un producto por ID
  app.get('/api/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
      await manager.loadProducts(); // Cargar productos con await
      const product = manager.getProductById(productId);

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }

    } catch (error) {
      res.status(500).json({ error: 'Error al cargar productos' });
    }
  });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});