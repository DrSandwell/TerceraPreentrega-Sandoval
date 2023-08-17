
import carrito from './carrito.js';

const productosGrid = document.querySelector('.Productos-grid');
const dropdownMenu = document.querySelector('.dropdown-menu');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
let productosData = [];

const cargarProductosData = async () => {
    try {
        const response = await fetch('../Js/listaProductos.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
};

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

function generarDropdownCategorias(productosData) {
    const categorias = obtenerCategoriasUnicas(productosData);

    categorias.forEach((categoria) => {
        const link = document.createElement('a');
        link.className = 'dropdown-item';
        link.textContent = categoria;
        dropdownMenu.appendChild(link);

        link.addEventListener('click', () => {
            filtrarCategorias(categoria);
        });
    });
}


const filtrarCategorias = (cat) => {
    const filtrado = productosData.filter(producto => producto.category === cat);
    generarHTMLProductos(filtrado);
}

function obtenerCategoriasUnicas(productosData) {    
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
            Swal.fire({
                title: 'No hubo coincidencias',
                text: 'No se encontraron productos que coincidan con la búsqueda.',
                icon: 'info',
            });
        }    
    }
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

document.addEventListener('DOMContentLoaded', async () => {

    productosData = await cargarProductosData();
    generarHTMLProductos(productosData);
    carrito.actualizarCarrito();
    generarDropdownCategorias(productosData);
});

