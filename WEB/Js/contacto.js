document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const btn = document.getElementById('button');
        btn.textContent = 'Enviando...';

        const serviceID = 'service_bfujq8g'; 
        const templateID = 'template_ubcf4vw'; 

        try {
            await emailjs.sendForm(serviceID, templateID, contactForm);            

            Swal.fire({
                title: '¡Éxito!',
                text: 'El correo electrónico se envió correctamente.',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload(); 
                }
            });
        } catch (error) {
            btn.textContent = 'Enviar';

            console.error('Error:', error);

            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el correo electrónico.',
                icon: 'error',
            });
        }
    });
});