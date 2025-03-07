var firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";

document.addEventListener("DOMContentLoaded", ucitajKorisnike);

function ucitajKorisnike() {
    let sviKorisnici = {};
    let xhttpKorisnici = new XMLHttpRequest();

    xhttpKorisnici.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sviKorisnici = JSON.parse(xhttpKorisnici.responseText);
                removeTableRows("teloTabele");
                for(let i in sviKorisnici) {
                    napraviTabeluKorisnika(sviKorisnici[i], i);
                }
                brisanjeKorisnika();
                izmenaKorisnika(sviKorisnici);
            }
            else {
                window.open("../greska.html");
            }
        }
    }

    xhttpKorisnici.open("GET", firebaseUrl + "/korisnici/" + ".json");
    xhttpKorisnici.send();
}

function removeTableRows(tBodyId) {
    let tBody = document.getElementById(tBodyId);
    while (tBody.firstChild) {
      tBody.removeChild(tBody.lastChild);
    }
}

function napraviTabeluKorisnika(korisnik, id) {
    let red = document.createElement("tr");

    let korisnickoImeKorisnika = document.createElement("td");
    korisnickoImeKorisnika.innerHTML = korisnik.korisnickoIme;

    let lozinkaKorisnika = document.createElement("td");
    lozinkaKorisnika.innerHTML = korisnik.lozinka;

    let imeKorisnika = document.createElement("td");
    imeKorisnika.innerHTML = korisnik.ime;

    let prezimeKorisnika = document.createElement("td");
    prezimeKorisnika.innerHTML = korisnik.prezime;

    let emailKorisnika = document.createElement("td");
    emailKorisnika.innerHTML = korisnik.email;

    let datumRodjenjaKorisnika = document.createElement("td");
    datumRodjenjaKorisnika.innerHTML = korisnik.datumRodjenja;

    let adresaKorisnika = document.createElement("td");
    adresaKorisnika.innerHTML = korisnik.adresa;

    let telefonKorisnika = document.createElement("td");
    telefonKorisnika.innerHTML = korisnik.telefon;

    let dugmeIzmena = document.createElement("button");
    dugmeIzmena.classList.add("btn", "btn-outline-light", "izmena");
    dugmeIzmena.setAttribute("id", id);

    let ikonaIzmena = document.createElement("i");
    ikonaIzmena.classList.add("bi", "bi-pen");
    dugmeIzmena.appendChild(ikonaIzmena);

    let dugmeObrisi = document.createElement("button");
    dugmeObrisi.classList.add("btn", "btn-outline-light", "obrisi");
    dugmeObrisi.setAttribute("id", id);

    let ikonaObrisi = document.createElement("i");
    ikonaObrisi.classList.add("bi", "bi-trash3");
    dugmeObrisi.appendChild(ikonaObrisi);

    let izmena = document.createElement("td");
    izmena.appendChild(dugmeIzmena);
    izmena.appendChild(dugmeObrisi);

    red.appendChild(korisnickoImeKorisnika);
    red.appendChild(lozinkaKorisnika);
    red.appendChild(imeKorisnika);
    red.appendChild(prezimeKorisnika);
    red.appendChild(emailKorisnika);
    red.appendChild(datumRodjenjaKorisnika);
    red.appendChild(adresaKorisnika);
    red.appendChild(telefonKorisnika);
    red.appendChild(izmena);

    let teloTabele = document.getElementsByTagName("tbody")[0];
    teloTabele.appendChild(red);
}

function brisanjeKorisnika() {
    var obrisi = document.getElementsByClassName("obrisi");
    for(let dugme of obrisi) {
        dugme.addEventListener("click", () => {
            let popup = document.getElementById("popupPotvrda");
            popup.classList.add("active");
            let dugmePotvrdi = document.getElementById("potvrdi");
            dugmePotvrdi.setAttribute("data-id", dugme.getAttribute("id"));
        })
    }
}

function obrisiKorisnika(obj) {
    let popup = document.getElementById("popupPotvrda");
    popup.classList.remove("active");
    var idKorisnika = obj.getAttribute("data-id");

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                ucitajKorisnike();
            }else {
                window.open("../greska.html");
            }
        }
    }

    request.open("DELETE", firebaseUrl + "/korisnici/" + idKorisnika + ".json");
    request.send();
}

var odustani = document.getElementById("odustani");
odustani.addEventListener("click", () => {
    let popup = document.getElementById("popupPotvrda");
    popup.classList.remove("active");
})

function izmenaKorisnika(sviKorisnici) {
    var izmena = document.getElementsByClassName("izmena");
    for(let dugme of izmena) {
        dugme.addEventListener("click", () => {
            let popup = document.getElementById("popupIzmena");
            popup.classList.add("active");
            let polja = popup.getElementsByTagName("input");
            for(let i in sviKorisnici) {
                if(i == dugme.getAttribute("id")) {
                    polja[0].value = sviKorisnici[i].korisnickoIme;
                    polja[1].value = sviKorisnici[i].lozinka;
                    polja[2].value = sviKorisnici[i].ime;
                    polja[3].value = sviKorisnici[i].prezime;
                    polja[4].value = sviKorisnici[i].email;
                    polja[5].value = sviKorisnici[i].datumRodjenja;
                    polja[6].value = sviKorisnici[i].adresa;
                    polja[7].value = sviKorisnici[i].telefon;
                    let potvrdi = formaIzmene.querySelector("button[type='submit']");
                    potvrdi.setAttribute("id", i);
                    break;
                }
            }
        })
    }
}

var formaIzmene = document.getElementById("formaIzmene");
var potvrdi = formaIzmene.querySelector("button[type='submit']");
var korisnickoImeKorisnik = formaIzmene[0];
var lozinkaKorisnik = formaIzmene[1];
var imeKorisnik = formaIzmene[2];
var prezimeKorisnik = formaIzmene[3];
var emailKorisnik = formaIzmene[4];
var datumRodjenjaKorisnik = formaIzmene[5];
var adresaKorisnik = formaIzmene[6];
var telefonKorisnik = formaIzmene[7];

potvrdi.addEventListener("click", e => {
    e.preventDefault();
    validirajPodatkeKorisnika(potvrdi.getAttribute("id"));
})

var isValidEmailKorisnika = email => {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
}

var isValidPhoneKorisnika = telefon => {
    const re = /^\d{9}$/;
    return re.test(telefon);
}

function validirajPodatkeKorisnika(id) {
    var korisnickoImeF = korisnickoImeKorisnik.value.trim();
    var lozinkaF = lozinkaKorisnik.value.trim();
    var imeF = imeKorisnik.value.trim();
    var prezimeF = prezimeKorisnik.value.trim();
    var emailF = emailKorisnik.value.trim();
    var datumRodjenjaF = datumRodjenjaKorisnik.value.trim();
    var adresaF = adresaKorisnik.value.trim();
    var telefonF = telefonKorisnik.value.trim();
    var izmena = true;

    if(korisnickoImeF === "") {
        izmena = false;
        setError(korisnickoImeKorisnik, "Polje korisnicko ime je obavezno!");
    }else {
        setSuccess(korisnickoImeKorisnik);
    }

    if(lozinkaF === "") {
        izmena = false;
        setError(lozinkaKorisnik, "Polje lozinka je obavezno!");
    }else {
        setSuccess(lozinkaKorisnik);
    }

    if(imeF === "") {
        izmena = false;
        setError(imeKorisnik, "Polje ime je obavezno!");
    }else {
        setSuccess(imeKorisnik);
    }

    if(prezimeF === "") {
        izmena = false;
        setError(prezimeKorisnik, "Polje prezime je obavezno!");
    }else {
        setSuccess(prezimeKorisnik);
    }

    if(emailF === "") {
        izmena = false;
        setError(emailKorisnik, "Polje email je obavezno!");
    }else if(!isValidEmailKorisnika(emailF)) {
        izmena = false;
        setError(emailKorisnik, "Pogresan format email adrese!");
    }else {
        setSuccess(emailKorisnik);
    }

    if(datumRodjenjaF === "") {
        izmena = false;
        setError(datumRodjenjaKorisnik, "Polje datum rodjenja je obavezno!");
    }else {
        setSuccess(datumRodjenjaKorisnik);
    }

    if(adresaF === "") {
        izmena = false;
        setError(adresaKorisnik, "Polje adresa je obavezno!");
    }else {
        setSuccess(adresaKorisnik);
    }

    if(telefonF === "") {
        izmena = false;
        setError(telefonKorisnik, "Polje telefon je obavezno!");
    }else if(!isValidPhoneKorisnika(telefonF)) {
        izmena = false;
        setError(telefonKorisnik, "Los format telefona!");
    }else{
        setSuccess(telefonKorisnik);
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

        izmeniKorisnika(korisnik, id);
    }
}

function izmeniKorisnika(korisnik, id) {
    let izmenaRequest = new XMLHttpRequest();
    izmenaRequest.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                let popupIzmena = document.getElementById("popupIzmena");
                popupIzmena.classList.remove("active");
                ucitajKorisnike();
            }else {
                window.open("../greska.html");
            }
        }
    }

    izmenaRequest.open("PUT", firebaseUrl + "/korisnici/" + id + ".json");
    izmenaRequest.send(JSON.stringify(korisnik));
}