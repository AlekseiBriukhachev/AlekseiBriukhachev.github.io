const hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu'),
    closeElem = document.querySelector('.menu__close'),
    menuOverlay = document.querySelector('.menu__overlay');

if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
        menu.classList.add('menu__active');
    });
}

if (closeElem && menu) {
    closeElem.addEventListener('click', () => {
        menu.classList.remove('menu__active');
    });
}

if (menuOverlay && menu) {
    menuOverlay.addEventListener('click', () => {
        menu.classList.remove('menu__active');
    });
}

const counters = document.querySelectorAll('.skills__ratings-counter'),
    lines = document.querySelectorAll('.skills__ratings-line span');

counters.forEach((item, i) => {
    if (lines[i]) {
        lines[i].style.width = item.innerHTML;
    }
});

function hideSideMenu() {
    if (menu) {
        menu.classList.remove('menu__active');
    }
}

const matrixCanvas = document.getElementById('matrixCanvas');

if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    if (!ctx) {
        console.warn('Matrix canvas is not supported in this browser.');
    } else {
        let width = 0;
        let height = 0;
        let columns = [];
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]();:,.!?';
        const fontSize = 22;
        const trailLength = 14;

        function resizeMatrix() {
            width = window.innerWidth;
            height = window.innerHeight;
            matrixCanvas.width = width * window.devicePixelRatio;
            matrixCanvas.height = height * window.devicePixelRatio;
            matrixCanvas.style.width = width + 'px';
            matrixCanvas.style.height = height + 'px';
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

            columns.length = 0;
            const visibleColumns = Math.max(32, Math.ceil(width / fontSize) + 8);
            for (let i = 0; i < visibleColumns; i++) {
                columns.push({
                    x: i * fontSize + Math.random() * fontSize,
                    y: Math.random() * -height,
                    speed: 1.2 + Math.random() * 8,
                    alpha: 0.5 + Math.random() * 0.35,
                    changeTimer: 0,
                    changeInterval: 8 + Math.floor(Math.random() * 10)
                });
            }
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(2, 11, 7, 0.18)';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                ctx.font = fontSize + 'px monospace';

                if (column.changeTimer >= column.changeInterval) {
                    column.changeTimer = 0;
                    const headChar = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillStyle = 'rgba(220, 255, 230, ' + (column.alpha + 0.12) + ')';
                    ctx.fillText(headChar, column.x, column.y);
                }

                for (let offset = 1; offset < trailLength; offset++) {
                    const y = column.y - offset * fontSize * 0.8;
                    if (y < 0 || y > height) continue;

                    const char = chars[Math.floor(Math.random() * chars.length)];
                    const alpha = Math.max(0.12, 1 - offset / trailLength) * column.alpha;

                    ctx.fillStyle = 'rgba(0, 255, 157, ' + alpha + ')';
                    ctx.fillText(char, column.x, y);
                }

                column.changeTimer += 1;

                if (column.y > height + 40) {
                    column.y = Math.random() * -60;
                    column.x = i * fontSize + Math.random() * fontSize;
                    column.changeTimer = 0;
                }

                column.y += column.speed;
            }

            requestAnimationFrame(drawMatrix);
        }

        resizeMatrix();
        requestAnimationFrame(drawMatrix);
        window.addEventListener('resize', resizeMatrix);
    }
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