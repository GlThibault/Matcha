$(function() {
    var password = document.getElementById("password"),
        confirm_password = document.getElementById("confirmpassword"),
        username = document.getElementById("username"),
        email = document.getElementById("email"),
        lastname = document.getElementById("lastname"),
        firstname = document.getElementById("username")

    function validatePassword() {
        if (password.value != confirm_password.value)
            confirm_password.setCustomValidity("Les mots de passe ne correspondent pas.")
        else if (password.value.length < 6)
            password.setCustomValidity("Erreur: votre mot de passe doit faire plus de 6 charactères.")
        else if (password.value.length > 50)
            password.setCustomValidity("Erreur: votre mot de passe doit faire moins de 50 charactères.")
        else if (password.value.search(/\d/) == -1)
            password.setCustomValidity("Erreur: votre mot de passe doit contenir au moins un chiffre")
        else if (password.value.search(/[a-z]/) == -1)
            password.setCustomValidity("Erreur: votre mot de passe doit contenir au moins une minuscule")
        else if (password.value.search(/[A-Z]/) == -1)
            password.setCustomValidity("Erreur: votre mot de passe doit contenir au moins une majuscule")
        else if (password.value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\\:]/) != -1)
            password.setCustomValidity("Erreur: votre mot de passe ne peux pas contenir d'autres charactères que a-z A-Z 0-9 ! @ # $ % ^ & * ( ) _ + . ,  :")
        else {
            password.setCustomValidity('')
            confirm_password.setCustomValidity('')
        }
    }

    function validateUsername() {
        if (username.value.search(/[^a-zA-Z0-9]/) != -1)
            username.setCustomValidity("Le nom d'utilisateur ne peux contenir que des lettres et des chiffres.")
        else if (username.value.length > 80)
            username.setCustomValidity("Erreur: votre nom d'utilisateur doit faire moins de 80 charactères.")
        else
            username.setCustomValidity('')
    }

    function validateEmail() {
        if (email.value.length > 200)
            email.setCustomValidity("Erreur: votre email doit faire moins de 200 charactères.")
        else
            email.setCustomValidity('')
    }

    function validateLastname() {
        if (lastname.value.length > 80)
            lastname.setCustomValidity("Erreur: votre nom doit faire moins de 80 charactères.")
        else
            lastname.setCustomValidity('')
    }

    function validateFirstname() {
        if (firstname.value.length > 80)
            firstname.setCustomValidity("Erreur: votre prénom doit faire moins de 80 charactères.")
        else
            firstname.setCustomValidity('')
    }
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;
    username.onchange = validateUsername;
    firstname.onchange = validateFirstname;
    lastname.onchange = validateLastname;
})
