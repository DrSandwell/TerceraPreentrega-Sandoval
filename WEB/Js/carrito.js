const carritoList = document.getElementById('carritoList');
const totalCarrito = document.getElementById('totalCarrito');
const carritoBtn = document.getElementById('carrito-btn');
const comprarBtn = document.getElementById('comprar-btn');
const closeModalBtn = document.getElementById('closeModalBtn');
const carritoModal = document.getElementById('carritoModal');
const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];



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
            guardarCarritoEnLocalStorage();
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
            guardarCarritoEnLocalStorage();
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
        Swal.fire({
            title: 'Carrito vacío',
            text: 'El carrito está vacío. Agrega productos antes de comprar.',
            icon: 'warning',
        });
    } else {
        const totalCompra = shoppingCart.reduce((total, item) => total + item.price * item.amount, 0);

        Swal.fire({
            title: 'Confirmar compra',
            text: `El total de su compra es $${totalCompra}. ¿Desea continuar?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Redireccionando',
                    text: 'Redireccionando a MercadoLibre...',
                    icon: 'info',
                });

                setTimeout(() => {
                    window.open('https://www.mercadolibre.com', '_blank');
                }, 1500); 
            } else {
                Swal.fire({
                    title: 'Compra cancelada',
                    text: 'Su compra ha sido cancelada.',
                    icon: 'error',
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});

export default {
    carritoList,
    totalCarrito,
    carritoModal,
    closeModalBtn,
    comprarBtn,
    carritoBtn,
    shoppingCart,
    actualizarCarrito,
    guardarCarritoEnLocalStorage,
    agregarAlCarrito
};