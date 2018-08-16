let loginCookie = readCookie('user_login'); // user login cookie value
let headers = new Headers(); // post headers
headers.append('Content-Type', 'application/json'); // post headers type json

if(loginCookie) { // login cookie exist
    fetch('/token/'+loginCookie) // check token in db
    .then(function(response) {
        return response.json();
    })
    .then(function(tokenResponse) { // response
        if(tokenResponse.message == 'match') { // token exist in db
            redirectPage('/cms');
        } else if (tokenResponse.message == 'noMatch') { // token does not exist in db
            deleteCookie('user_login');
            refreshPage();
        }
    });
} else {
    document.getElementById("splashContainer").style.display = "none" // hide splash element
    const loginUsername = document.getElementById("loginUsername"); // username element
    const loginPassword = document.getElementById("loginPassword"); // password element
    const loginSubmit = document.getElementById("loginSubmit"); // submit element
    let password = ''; // password variable
    loginSubmit.addEventListener('click', () => { // login submit click
        if(loginPassword.value.length >= 5) { // password longer than 5 characters
            password = hashMd5(loginPassword.value);
        } else { // password shorter than 5 characters
            password = loginPassword.value;
        }
        let init = { // post login
            method: 'POST',
            headers: headers,
            body: `{"username":"${loginUsername.value}","password":"${password}","unix":"${createUnix()}","token":"${createToken()}"}`,
            cache: 'no-cache',
            mode: 'cors'
        };
        let request = new Request('/login', init);
        fetch(request)
        .then(response => {
            return response.json();
        })
        .then((data) => { // post login response
            if(data.message == 'userLoggedIn') { // user logged in
                createCookie('user_login', data.token, 30); // create user login cookie
                redirectPage('/cms'); // redirect page to cms panel
            } else if(data.message == 'error') {
                alert('error: '+data.error);
            } else if(data.message == 'noMatchPassword') {
                alert('Adgangskoden matcher ikke brugeren.');
            } else if(data.message == 'shortPassword') {
                alert('Adgangskoden er for kort.');
            } else if(data.message == 'noMatchUsername') {
                alert('Brugeren eksisterer ikke.');
            } else if(data.message == 'shortUsername') {
                alert('Dit brugernavn er for kort.');
            }
        });
    });
}