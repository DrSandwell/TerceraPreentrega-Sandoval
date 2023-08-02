import productosData from './listaProductos.js';
import carrito from './carrito.js';

const productosGrid = document.querySelector('.Productos-grid');
const dropdownMenu = document.querySelector('.dropdown-menu');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

function generarHTMLProductos(productos) {
    productosGrid.innerHTML = '';

    const busqueda = searchInput.value.trim().toLowerCase();
    productos.forEach((product) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
        <img class="image" src="${product.imgUrl}" alt="${product.name}">
        <span class="title">${product.name}</span>
        <span class="price">$${product.price}</span>
        `;
        productosGrid.appendChild(div);
        div.addEventListener('click', () => {
            carrito.agregarAlCarrito(product);
        }); 

        const nombreProducto = product.name.toLowerCase();
        if (nombreProducto.includes(busqueda)) {
            div.style.display = 'block'; 
        } else {
            div.style.display = 'none'; 
        }
    });
}

function generarDropdownCategorias() {
    const categorias = obtenerCategoriasUnicas();
    categorias.forEach((categoria) => {
        const link = document.createElement('a');
        link.className = 'dropdown-item';
        link.textContent = categoria;        
        link.href = `productos.html?categoria=${encodeURIComponent(categoria)}`;
        dropdownMenu.appendChild(link);
    });
}

function obtenerCategoriasUnicas() {    
    const categoriasUnicas = new Set(productosData.map((producto) => producto.category));
    return [...categoriasUnicas];
}

function buscarProductos(busqueda) {
    if (busqueda === '') {        
        generarHTMLProductos(productosData);
    } else {
        const productosFiltrados = productosData.filter((product) =>
            product.name.toLowerCase().includes(busqueda.toLowerCase())
        );
        if (productosFiltrados.length > 0) {
            generarHTMLProductos(productosFiltrados);
        } else {
            mostrarVentanaEmergente('No hubo coincidencias');
        }
    }
}

function mostrarVentanaEmergente(mensaje) {
    const ventanaEmergente = document.createElement('div');
    ventanaEmergente.className = 'ventana-emergente';
    ventanaEmergente.innerHTML = `
        <div class="mensaje">${mensaje}</div>
    `;
    document.body.appendChild(ventanaEmergente);

    setTimeout(() => {
        ventanaEmergente.remove();
    }, 2000); 
}

searchButton.addEventListener('click', () => {
    const busqueda = searchInput.value.trim();
    buscarProductos(busqueda);
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        const busqueda = searchInput.value.trim();
        buscarProductos(busqueda);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    generarHTMLProductos(productosData);
    carrito.actualizarCarrito();
    generarDropdownCategorias();
});

