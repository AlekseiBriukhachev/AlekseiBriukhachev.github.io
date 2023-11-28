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

counters.forEach( (item, i) => {
    lines[i].style.width = item.innerHTML;
});
function hideSideMenu() {
    menu.classList.remove('menu__active');
}

function sendEmail() {

    emailjs.init("YtSNTgUc2utpTMt2g");

    var fromName = document.getElementById("name").value;
    console.log(fromName);
    var toName = "Aleksei";
    
    var message = document.getElementById("messageText").value;

    var replyTo = document.getElementById("email").value;
    console.log(message);

    var data = {
                from_name: fromName,
                to_name: toName,
                message: message,
                reply_to: replyTo                              
            };

    emailjs.send("service_0oda5fd", "gmail_f0oxdx6", data)
        .then(function(response) {
        alert("Email sent successfully");
        }, function(error) {
        alert("Email failed to send");
        });
}