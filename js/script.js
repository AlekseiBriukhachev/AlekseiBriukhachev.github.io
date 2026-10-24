const hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu'),
    closeElem = document.querySelector('.menu__close'),
    menuOverlay = document.querySelector('.menu__overlay');
hamburger.addEventListener('click', () => {
    menu.classList.add('menu__active');
});

closeElem.addEventListener('click', () => {
    menu.classList.remove('menu__active');
});

if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
        menu.classList.remove('menu__active');
    });
}

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
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const consentCheckbox = document.getElementById('consentCheckbox');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const maxLength = 2000;

    function validateForm() {
        const name = nameField ? nameField.value.trim() : '';
        const email = emailField ? emailField.value.trim() : '';
        const message = messageField ? messageField.value.trim() : '';
        const consent = consentCheckbox ? consentCheckbox.checked : false;

        const isValid = Boolean(name && email && message && consent && message.length <= maxLength);

        if (submitButton) {
            submitButton.disabled = !isValid;
        }
    }

    if (messageField) {
        messageField.setAttribute('maxlength', String(maxLength));
    }

    [nameField, emailField, messageField, consentCheckbox].forEach(field => {
        if (field) {
            field.addEventListener('input', validateForm);
            field.addEventListener('change', validateForm);
        }
    });

    validateForm();

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const consentCheckboxCurrent = document.getElementById('consentCheckbox');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            return;
        }

        if (!consentCheckboxCurrent || !consentCheckboxCurrent.checked) {
            const existingStatus = contactForm.querySelector('.contacts__form-status');
            const formStatus = document.createElement('div');
            formStatus.className = 'contacts__form-status error';
            formStatus.textContent = 'Please confirm that you agree to be contacted by email.';

            if (existingStatus) {
                existingStatus.remove();
            }

            contactForm.appendChild(formStatus);
            return;
        }

        if (message.length > maxLength) {
            return;
        }

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
                    validateForm();
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
                    validateForm();
                }
            });
    });
}