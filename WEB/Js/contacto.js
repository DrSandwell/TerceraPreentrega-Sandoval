document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);

        let loadingAlert;

        Swal.fire({
            title: 'Enviando formulario...',
            html: 'Por favor, espera...',
            timerProgressBar: true,
            allowOutsideClick: false,
            onBeforeOpen: () => {
                loadingAlert = Swal.getContent().querySelector('strong');
                Swal.showLoading();
                const timerInterval = setInterval(() => {
                    loadingAlert.textContent = Swal.getTimerLeft();
                }, 100);
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
        });

        try {
            const response = await fetch("https://formsubmit.co/ajax/nikesandwell@gmail.com", {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            const responseData = await response.json();

            if (responseData.success === 'true') {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El formulario se envió correctamente.',
                    icon: 'success',
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar el formulario.',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el formulario.',
                icon: 'error',
            });
        }
    });
});
