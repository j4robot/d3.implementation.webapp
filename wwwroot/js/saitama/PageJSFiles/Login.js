const peps = [{achana: 'Achana@123', michael: 'Mike@123', persol: 'Persol@123', akiti: 'Akiti@123'}];

if(localStorage.getItem("chairman")){
    localStorage.removeItem("chairman");
}

document.querySelector('#txtPassword').addEventListener('keyup', function (e) {

    let txtUsername = document.querySelector('#txtUsername').value;

    if (e.which === 13 && (txtUsername && this.value)) {
        document.querySelector('#btnSignIn').click();
        return false;
    }

});

document.querySelector('#btnSignIn').addEventListener('click', function (e) {
    e.preventDefault()

    if(checkAccess()){
        let expires = Date.now() + 1000 * 60 * 60;
        let info = {state: 1, expires, name: document.querySelector('#txtUsername').value};
        localStorage.setItem('chairman', JSON.stringify(info));

        window.location = window.location.href.indexOf("localhost") > -1 ? `${window.location.origin}/home/dashboard` : `${window.location.origin}/hcm-apps-controls/home/dashboard`;
    }
    else{
        iziToast.show({
            color: 'blue',
            icon: 'fa fa-info',
            position: 'topRight',
            message: 'Username or password is incorrect!'
        });
    }
    
});

document.querySelector('#btnSignIn').click();

function checkAccess(){
    let txtUsername = "achana";//document.querySelector('#txtUsername').value;
    let txtPassword = 'Achana@123'; //document.querySelector('#txtPassword').value;

    return (txtUsername && txtPassword && Object.keys(peps[0]).includes(txtUsername.toLowerCase()) && peps[0][txtUsername.toLowerCase()] === txtPassword);
}