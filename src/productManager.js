const fs = require('fs'); // Importa el módulo 'fs' para trabajar con archivos en Node.js

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.autoIncrementId = 1;
        this.path = filePath;
        this.loadProducts();
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const newProduct = {
            ...product,
            id: this.autoIncrementId++,
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts() {
        this.loadProducts();
        return this.products;
    }

    getProductById(id) {
        this.loadProducts();

        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.error("Producto no encontrado");
        }
        return product;
    }

    updateProduct(id, updatedProduct) {
        this.loadProducts();

        const index = this.products.findIndex((p) => p.id === id);

        if (index === -1) {
            console.error("Producto no encontrado");
            return false;
        }

        this.products[index] = {
            ...this.products[index],
            ...updatedProduct,
            id: id,
        };

        this.saveProducts();
        return true;
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos en el archivo JSON:", error);
        }
    }

    deleteProduct(id) {
        this.loadProducts();

        const index = this.products.findIndex((p) => p.id === id);

        if (index === -1) {
            console.error("Producto no encontrado");
            return false;
        }

        this.products.splice(index, 1);
        this.saveProducts();
        return true;
    }
}


const manager = new ProductManager('productos.json');


module.exports = ProductManager;