var login = document.getElementById("login");
login.addEventListener("click", () => {
    let popupLogin = document.getElementById("popupLogin");
    popupLogin.classList.add("active");
})

var izlaz = document.getElementsByClassName("izlaz");
for(let element of izlaz){
    element.addEventListener("click", () => {
        let popupi = document.getElementsByClassName("popup");
        let popupRegistracija = document.getElementById("popupRegistracija");
        let polja = popupRegistracija.getElementsByTagName("input");
        for(let popup of popupi) {
            popup.classList.remove("active");
        }
        for(let polje of polja) {
            polje.value = "";
        }
    })
};

var registracija = document.getElementById("registracija");
registracija.addEventListener("click", () => {
    let popupRegistracija = document.getElementById("popupRegistracija");
    let popupLogin = document.getElementById("popupLogin");
    popupLogin.classList.remove("active");
    popupRegistracija.classList.add("active");
})

var dugme = document.querySelector("#popupRegistracija button[type='submit']");
var korisnickoIme = document.getElementById("korisnickoIme");
var lozinka = document.getElementById("lozinka");
var ime = document.getElementById("ime");
var prezime = document.getElementById("prezime");
var email = document.getElementById("email");
var datumRodjenja = document.getElementById("datumRodjenja");
var adresa = document.getElementById("adresa");
var telefon = document.getElementById("telefon");

dugme.addEventListener("click", e => {
    e.preventDefault();
    validirajPodatke();
})

var setError = (element, poruka) => {
    var kontrolaUpisa = element.parentElement;
    var ispis = kontrolaUpisa.querySelector(".error");
    ispis.innerHTML = poruka;
    kontrolaUpisa.classList.add("error");
    kontrolaUpisa.classList.remove("success");
}

var setSuccess = (element) => {
    var kontrolaUpisa = element.parentElement;
    var ispis = kontrolaUpisa.querySelector(".error");
    ispis.innerHTML = "";
    kontrolaUpisa.classList.add("success");
    kontrolaUpisa.classList.remove("error");
}

var isValidEmail = email => {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
}

var isValidPhone = telefon => {
    const re = /^\d{9}$/;
    return re.test(telefon);
}

function validirajPodatke() {
    var korisnickoImeF = korisnickoIme.value.trim();
    var lozinkaF = lozinka.value.trim();
    var imeF = ime.value.trim();
    var prezimeF = prezime.value.trim();
    var emailF = email.value.trim();
    var datumRodjenjaF = datumRodjenja.value.trim();
    var adresaF = adresa.value.trim();
    var telefonF = telefon.value.trim();
    var izmena = true;

    proveriKorisnickoIme(korisnickoImeF);
    if(korisnickoIme.parentElement.classList.contains("error")) {
        izmena = false;
    }

    if(korisnickoImeF === "") {
        izmena = false;
        setError(korisnickoIme, "Polje korisnicko ime je obavezno!");
    }else{
        setSuccess(korisnickoIme);
    }

    if(lozinkaF === "") {
        izmena = false;
        setError(lozinka, "Polje lozinka je obavezno!");
    }else {
        setSuccess(lozinka);
    }

    if(imeF === "") {
        izmena = false;
        setError(ime, "Polje ime je obavezno!");
    }else {
        setSuccess(ime);
    }

    if(prezimeF === "") {
        izmena = false;
        setError(prezime, "Polje prezime je obavezno!");
    }else {
        setSuccess(prezime);
    }

    if(emailF === "") {
        izmena = false;
        setError(email, "Polje email je obavezno!");
    }else if(!isValidEmail(emailF)) {
        izmena = false;
        setError(email, "Pogresan format email adrese!");
    }else {
        setSuccess(email);
    }

    if(datumRodjenjaF === "") {
        izmena = false;
        setError(datumRodjenja, "Polje datum rodjenja je obavezno!");
    }else {
        setSuccess(datumRodjenja);
    }

    if(adresaF === "") {
        izmena = false;
        setError(adresa, "Polje adresa je obavezno!");
    }else {
        setSuccess(adresa);
    }

    if(telefonF === "") {
        izmena = false;
        setError(telefon, "Polje telefon je obavezno!");
    }else if(!isValidPhone(telefonF)) {
        izmena = false;
        setError(telefon, "Los format telefona!");
    }else{
        setSuccess(telefon);
    }

    if(izmena) {
        korisnik = {};
        korisnik.korisnickoIme = korisnickoImeF;
        korisnik.lozinka = lozinkaF;
        korisnik.ime = imeF;
        korisnik.prezime = prezimeF;
        korisnik.email = emailF;
        korisnik.datumRodjenja = datumRodjenjaF;
        korisnik.adresa = adresaF;
        korisnik.telefon = telefonF;

        dodajKorisnika(korisnik);
    }
}

function validirajLogin() {
    let firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";
    let sviKorisnici = {};
    let xhttpKorisnici = new XMLHttpRequest();

    xhttpKorisnici.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sviKorisnici = JSON.parse(xhttpKorisnici.responseText);
                var userName = document.getElementById("username");
                var password = document.getElementById("password");
                let userNameK = userName.value.trim();
                let passwordK = password.value.trim();
                let uspeh = false;
                for(let i in sviKorisnici) {
                    if(userNameK != sviKorisnici[i].korisnickoIme) {
                        continue;
                    }
                    if(passwordK != sviKorisnici[i].lozinka) {
                        continue;
                    }
                    let uspesanLogin = document.getElementById("uspesanLogin");
                    let loginProzor = document.getElementById("popupLogin");
                    uspesanLogin.classList.add("active");
                    loginProzor.classList.remove("active");
                    userName.value = "";
                    password.value = "";
                    userName.parentElement.classList.remove("error");
                    password.parentElement.classList.remove("error");
                    let ispisUserName = userName.parentElement.querySelector(".error");
                    let ispisPassword = password.parentElement.querySelector(".error");
                    ispisUserName.innerHTML = "";
                    ispisPassword.innerHTML = "";
                    uspeh = true;
                }
                
                if(!uspeh) {
                    setError(userName, "Pogresno korisnicko ime");
                    setError(password, "Pogresna lozinka");
                }
            }else {
                window.open("greska.html");
            }
        }
    }
    xhttpKorisnici.open("GET", firebaseUrl + "/korisnici/" + ".json");
    xhttpKorisnici.send();
}

function proveriKorisnickoIme(KI) {
    let firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";
    let sviKorisnici = {};
    let xhttpKorisnici = new XMLHttpRequest();

    xhttpKorisnici.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sviKorisnici = JSON.parse(xhttpKorisnici.responseText);
                for(let i in sviKorisnici) {
                    if(KI === sviKorisnici[i].korisnickoIme) {
                        setError(korisnickoIme, "vec postoji isto korisnicko ime!");
                    }
                }
            } else {
                window.open("../greska.html");
            }
        }
    }
    xhttpKorisnici.open("GET", firebaseUrl + "/korisnici/" + ".json");
    xhttpKorisnici.send();
}

function dodajKorisnika(korisnik) {
    let firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";
    let sviKorisnici = {};
    let xhttpKorisnici = new XMLHttpRequest();

    xhttpKorisnici.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                let popup = document.getElementById("popupRegistracija");
                popup.classList.remove("active");
                ucitajKorisnike();
            } else {
                window.open("../greska.html");
            }
        }
    }
    xhttpKorisnici.open("POST", firebaseUrl + "/korisnici/" + ".json");
    xhttpKorisnici.send(JSON.stringify(korisnik));
}