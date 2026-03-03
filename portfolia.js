// Typed.js animation
var typed = new Typed('#element', {
    strings: ['Web Developer', 'Software Developer'],
    typeSpeed: 50,
});

// Email sending with Email.js
function sendEmail() {
    const name = document.querySelector('.text-id').value;
    const email = document.querySelector('.text-email').value;
    const issue = document.querySelector('.text-project').value;
    const message = document.querySelector('.text-mesg').value;

    if (name.trim() === '' || email.trim() === '' || issue.trim() === '' || message.trim() === '') {
        alert('Please fill in all fields.');
        return false;
    }

    const templateParams = {
        from_name: name,
        from_email: email,
        project_title: issue,
        message: message
    };

    // Send using Email.js
    emailjs.send('service_i6oxght', 'template_rfs0a1u', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Message sent successfully!');
            clearInputFields();
        }, function(error) {
            console.log('FAILED...', error);
            alert('Failed to send message. Please try again later.');
        });

    return false;
}

// Clear all input fields after submission
function clearInputFields() {
    document.querySelector('.text-id').value = '';
    document.querySelector('.text-email').value = '';
    document.querySelector('.text-project').value = '';
    document.querySelector('.text-mesg').value = '';
}
