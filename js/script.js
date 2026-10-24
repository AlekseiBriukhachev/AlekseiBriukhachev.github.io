const hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu'),
    closeElem = document.querySelector('.menu__close');
hamburger.addEventListener('click', () => {
    menu.classList.add('menu__active');
});

closeElem.addEventListener('click', () => {
    menu.classList.remove('menu__active');
});

const counters = document.querySelectorAll('.skills__ratings-counter'),
    lines = document.querySelectorAll('.skills__ratings-line span');

counters.forEach((item, i) => {
    lines[i].style.width = item.innerHTML;
});
function hideSideMenu() {
    menu.classList.remove('menu__active');
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const messageField = document.getElementById('message');
    const maxLength = 2000;

    if (messageField) {
        messageField.setAttribute('maxlength', String(maxLength));
    }

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            return;
        }

        if (message.length > maxLength) {
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formStatus = document.createElement('div');
        formStatus.className = 'contacts__form-status';
        formStatus.textContent = 'Sending...';

        const existingStatus = contactForm.querySelector('.contacts__form-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        contactForm.appendChild(formStatus);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        fetch(contactForm.action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: new FormData(contactForm)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.textContent = 'Message sent successfully.';
                    formStatus.classList.remove('error');
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Something went wrong. Please try again.';
                    formStatus.classList.add('error');
                }
            })
            .catch(() => {
                formStatus.textContent = 'Something went wrong. Please try again.';
                formStatus.classList.add('error');
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send message';
                }
            });
    });
}