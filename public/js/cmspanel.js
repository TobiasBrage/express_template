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
            document.getElementById("splashContainer").style.display = "none" // hide splash element
            const userName = document.getElementById("newUserName"); // username element
            const userForName = document.getElementById("newUserForName"); // user first name element
            const userLastName = document.getElementById("newUserLastName"); // user last name element
            const userPassword = document.getElementById("newUserPassword"); // user password element
            const userRepeat = document.getElementById("newUserRepeat"); // user password repeat element
            const userSubmit = document.getElementById("newUserSubmit"); // user submit element
            userSubmit.addEventListener('click', () => {
                console.log(`User created. Username: ${userName.value}, First name: ${userForName.value}, Last name: ${userLastName.value}`);
            });

        } else if (tokenResponse.message == 'noMatch') { // token does not exist in db
            deleteCookie('user_login');
            refreshPage();
        }
    });
} else {
    redirectPage('/login');
}

function removeUser(userId) {
    if (confirm("Er du sikker på at du vil fjerne denne bruger?")) {
        let init = {
            method: 'DELETE',
            headers: headers,
            body: `{"userId":"${userId}"}`,
            cache: 'no-cache',
            mode: 'cors'
        };
        let request = new Request('/user/remove', init);
        fetch(request)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            if(data.message == 'userRemoved') {
                alert('Brugeren blev fjernet.');
                refreshPage();
            } else if(data.message == 'error') {
                alert('Der skete desværre en fejl: '+data.error);
            }
        });
    }
}