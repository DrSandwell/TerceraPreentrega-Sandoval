import productosData from './productos.js';

const productosGrid = document.querySelector('.Productos-grid');
const carritoList = document.getElementById('carritoList');
const totalCarrito = document.getElementById('totalCarrito');
const carritoBtn = document.getElementById('carrito-btn');
const comprarBtn = document.getElementById('comprar-btn');
const closeModalBtn = document.getElementById('closeModalBtn');
const carritoModal = document.getElementById('carritoModal');
const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
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
            agregarAlCarrito(product);
        }); 

        const nombreProducto = product.name.toLowerCase();
        if (nombreProducto.includes(busqueda)) {
            div.style.display = 'block'; 
        } else {
            div.style.display = 'none'; 
        }
    });
}

function agregarAlCarrito(producto) {
    const carritoItem = shoppingCart.find((item) => item.id === producto.id);

    if (carritoItem) {
        carritoItem.amount++;
    } else {
        shoppingCart.push({
            id: producto.id,
            img: producto.imgUrl,
            name: producto.name,
            price: producto.price,
            amount: 1,
        });
    }

    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

function actualizarCarrito() {
    carritoList.innerHTML = '';
    let total = 0;

    shoppingCart.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="carrito-img">
        <span>${item.name}</span>
        <button class="remove-btn">-</button>
        <span class="cantidad">${item.amount}</span>
        <button class="add-btn">+</button>
        <span>Precio: $${item.price * item.amount}</span>
    `;

        carritoList.appendChild(li);
        total += item.price * item.amount;
    });

    totalCarrito.textContent = `Total: $${total}`;
    
    const addButtons = document.querySelectorAll('.add-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');

    addButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            shoppingCart[index].amount++;
            actualizarCarrito();
        });
    });

    removeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (shoppingCart[index].amount > 1) {
                shoppingCart[index].amount--;
            } else {
                shoppingCart.splice(index, 1);
            }
            actualizarCarrito();
        });
    });
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}
carritoBtn.addEventListener('click', () => {
    carritoModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    carritoModal.style.display = 'none';
});

comprarBtn.addEventListener('click', () => {
    if (shoppingCart.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de comprar.');
    } else {
        const totalCompra = shoppingCart.reduce((total, item) => total + item.price * item.amount, 0);
        const confirmacion = confirm(`El total de su compra es $${totalCompra}. ¿Desea continuar?`);

        if (confirmacion) {            
            alert('Redireccionando a MercadoLibre...');
            window.open('https://www.mercadolibre.com', '_blank');
        } else {
            alert('Compra cancelada.');
        }
    }
});

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
    actualizarCarrito();
    generarDropdownCategorias();
});

