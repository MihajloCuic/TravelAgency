var firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";

document.addEventListener("DOMContentLoaded", ucitajAgencije);
//ucitavanje agencija iz baze i punjenje tabele njihovim podacima
function ucitajAgencije() {
    let sveAgencije = {};
    let xhttpAgencije = new XMLHttpRequest();

    xhttpAgencije.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveAgencije = JSON.parse(xhttpAgencije.responseText);
                removeTableRows("teloTabele");
                napraviTabeluAgencija(sveAgencije);
                brisanjeAgencije();
                izmeniAgenciju(sveAgencije);
            }
            else {
                window.open("../greska.html");
            }
        }
    }

    xhttpAgencije.open("GET", firebaseUrl + "/agencije/" + ".json");
    xhttpAgencije.send();
}

function removeTableRows(tBodyId) {
    let tBody = document.getElementById(tBodyId);
    while (tBody.firstChild) {
      tBody.removeChild(tBody.lastChild);
    }
}

function napraviTabeluAgencija(sveAgencije) {
    for(let i in sveAgencije) {
        let red = document.createElement("tr");

        let nazivAgencije = document.createElement("td");
        nazivAgencije.innerHTML = sveAgencije[i].naziv;

        let logoAgencije = document.createElement("td");
        let slika = document.createElement("img");
        slika.src = sveAgencije[i].logo;
        slika.height = "100";
        slika.width = "100";
        slika.classList.add("img-fluid");
        logoAgencije.appendChild(slika);

        let adresaAgencije = document.createElement("td");
        adresaAgencije.innerHTML = sveAgencije[i].adresa;

        let godinaAgencije = document.createElement("td");
        godinaAgencije.innerHTML = sveAgencije[i].godina;

        let telefonAgencije = document.createElement("td");
        telefonAgencije.innerHTML = sveAgencije[i].brojTelefona;

        let emailAgencije = document.createElement("td");
        emailAgencije.innerHTML = sveAgencije[i].email;

        let dugmeIzmena = document.createElement("button");
        dugmeIzmena.classList.add("btn", "btn-outline-light", "izmena");
        dugmeIzmena.setAttribute("id", i);
        let ikonaIzmena = document.createElement("i");
        ikonaIzmena.classList.add("bi", "bi-pen");
        dugmeIzmena.appendChild(ikonaIzmena);

        let dugmeObrisi = document.createElement("button");
        dugmeObrisi.classList.add("btn", "btn-outline-light", "obrisi");
        dugmeObrisi.setAttribute("id", i);
        let ikonaObrisi = document.createElement("i");
        ikonaObrisi.classList.add("bi", "bi-trash3");
        dugmeObrisi.appendChild(ikonaObrisi);
        

        let poljeIzmena = document.createElement("td");
        poljeIzmena.appendChild(dugmeIzmena);
        poljeIzmena.appendChild(dugmeObrisi);

        red.appendChild(nazivAgencije);
        red.appendChild(logoAgencije);
        red.appendChild(adresaAgencije);
        red.appendChild(godinaAgencije);
        red.appendChild(telefonAgencije);
        red.appendChild(emailAgencije);
        red.appendChild(poljeIzmena);

        let teloTabele = document.getElementsByTagName("tbody")[0];
        teloTabele.appendChild(red);
    }
}
//brisanje agencije
function brisanjeAgencije() {
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

function obrisiAgenciju(obj) {
    let popup = document.getElementById("popupPotvrda");
    popup.classList.remove("active");
    var idAgencije = obj.getAttribute("data-id");

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                ucitajAgencije();
            }else {
                window.open("../greska.html");
            }
        }
    }

    request.open("DELETE", firebaseUrl + "/agencije/" + idAgencije + ".json");
    request.send();
}

var odustani = document.getElementById("odustani");
odustani.addEventListener("click", () => {
    let popup = document.getElementById("popupPotvrda");
    popup.classList.remove("active");
})
//ucitavanje popup-a za izmenu podataka agencije
function izmeniAgenciju(sveAgencije) {
    var izmena = document.getElementsByClassName("izmena");
    for(let dugme of izmena) {
        dugme.addEventListener("click", () => {
            let popup = document.getElementById("popupIzmena");
            popup.classList.add("active");
            let polja = popup.getElementsByTagName("input");
            for(let i in sveAgencije) {
                if(i == dugme.getAttribute("id")) {
                    polja[0].value = sveAgencije[i].naziv;
                    polja[1].value = sveAgencije[i].logo;
                    polja[2].value = sveAgencije[i].adresa;
                    polja[3].value = sveAgencije[i].godina;
                    polja[4].value = sveAgencije[i].brojTelefona;
                    polja[5].value = sveAgencije[i].email;
                    let dugmeSubmit = popup.querySelector("button[type='submit']");
                    dugmeSubmit.setAttribute("id", i);
                    let destinacijeDugme = document.getElementById("destinacije");
                    let dugmeDes = destinacijeDugme.children[0];
                    dugmeDes.setAttribute("id-data", sveAgencije[i].destinacije);
                    break;
                }
            }
        })
    }
}

//Operacije sa destinacijama i njihovim podacima
function destinacije(obj) {
    let popupDestinacije = document.getElementById("popupDestinacije");
    let tbody = popupDestinacije.getElementsByTagName("tbody")[0];
    while(tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }
    popupDestinacije.classList.add("active");
    let popupIzmena = document.getElementById("popupIzmena");
    popupIzmena.classList.remove("active");
    let idDestinacija = obj.getAttribute("id-data");
    let dugmeDodaj = popupDestinacije.querySelector("button[type='button']");
    dugmeDodaj.setAttribute("id-data", idDestinacija);
    let sveDestinacije = {};
    let destinacijeRequest = new XMLHttpRequest();

    destinacijeRequest.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveDestinacije = JSON.parse(destinacijeRequest.responseText);
                    for(let i in sveDestinacije[idDestinacija]) {
                        let red = document.createElement("tr");
                        let kolonaNaziv = document.createElement("td");
                        let kolonaDugmeIzmena = document.createElement("td");
                        let kolonaDugmeObrisi = document.createElement("td");
    
                        kolonaNaziv.innerHTML = sveDestinacije[idDestinacija][i].naziv;
    
                        let dugmeIzmenaDestinaciju = document.createElement("button");
                        dugmeIzmenaDestinaciju.classList.add("btn", "btn-outline-light");
                        dugmeIzmenaDestinaciju.setAttribute("id-data", i);
                        dugmeIzmenaDestinaciju.setAttribute("onclick", "izmeniDestinaciju(this)");
                        let ikonaIzmenaDestinaciju = document.createElement("i");
                        ikonaIzmenaDestinaciju.classList.add("bi", "bi-pen");
                        dugmeIzmenaDestinaciju.appendChild(ikonaIzmenaDestinaciju);
                        kolonaDugmeIzmena.appendChild(dugmeIzmenaDestinaciju);
    
                        let dugmeObrisiDestinaciju = document.createElement("button");
                        dugmeObrisiDestinaciju.classList.add("btn", "btn-outline-light");
                        dugmeObrisiDestinaciju.setAttribute("id-data", i);
                        dugmeObrisiDestinaciju.setAttribute("onclick", "pronadjiDestinacijuZaBrisanje(this)");
                        let ikonaObrisiDestinaciju = document.createElement("i");
                        ikonaObrisiDestinaciju.classList.add("bi", "bi-trash3");
                        dugmeObrisiDestinaciju.appendChild(ikonaObrisiDestinaciju);
                        kolonaDugmeObrisi.appendChild(dugmeObrisiDestinaciju);
    
                        red.appendChild(kolonaNaziv);
                        red.appendChild(kolonaDugmeIzmena);
                        red.appendChild(kolonaDugmeObrisi);
                        tbody.appendChild(red);
                    }
            }else {
                window.open("../greska.html");
            }
        }
    }

    destinacijeRequest.open("GET", firebaseUrl + "/destinacije/" + ".json");
    destinacijeRequest.send();
}

function pronadjiDestinacijuZaBrisanje(obj) {
    let idDestinacije = obj.getAttribute("id-data");
    let sveDestinacije = {};
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveDestinacije = JSON.parse(xhttp.responseText);
                for(let i in sveDestinacije) {
                    if(sveDestinacije[i][idDestinacije] != null) {
                        obrisiDestinaciju(idDestinacije, i);
                    }
                }
            }else {
                window.open("../greska.html");
            }
        }
    }
    xhttp.open("GET", firebaseUrl + "/destinacije/" + ".json");
    xhttp.send();
}

function izmeniDestinaciju(obj) {
    let idDestinacije = obj.getAttribute("id-data");
    let izmenaAgencijePopup = document.getElementById("popupIzmena");
    let izmenaDestinacijePopup = document.getElementById("popupIzmenaDestinacije");

    izmenaAgencijePopup.classList.remove("active");
    izmenaDestinacijePopup.classList.add("active");

    ucitajInformacijeDestinacije(idDestinacije, izmenaDestinacijePopup);
}

var formaIzmeneDestinacije = document.getElementById("formaIzmeneDestinacije");
var potvrdiDestinaciju = formaIzmeneDestinacije.querySelector("button[type='submit']");

function ocistiInpute() {
    let popupIzmenaDestinacije = document.getElementById("popupIzmenaDestinacije");
    let inputi = popupIzmenaDestinacije.getElementsByTagName("input");
    inputi[0].value = "";
    inputi[1].value = "";
    inputi[2].value = "";
    inputi[3].value = "";
    inputi[4].value = "";
    inputi[5].value = "";
    inputi[6].value = "";

}

function destinacijaForma(obj) {
    ocistiInpute();
    let popup = document.getElementById("popupIzmenaDestinacije");
    let popupDestinacije = document.getElementById("popupDestinacije");
    popup.classList.add("active");
    popupDestinacije.classList.remove("active");

    potvrdiDestinaciju.addEventListener("click", e => {
        e.preventDefault();
        validirajPodatkeDestinacije([], obj.getAttribute("id-data"), null, true);
    })
}

function ucitajInformacijeDestinacije(id, popupDestinacije) {
    let sveDestinacije = {};
    let xhttp = new XMLHttpRequest();
    let inputi = popupDestinacije.getElementsByTagName("input");
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveDestinacije = JSON.parse(xhttp.responseText);
                for(let i in sveDestinacije) {
                    for(let j in sveDestinacije[i]) {
                        if(j == id) {
                            inputi[0].value = sveDestinacije[i][j].naziv;
                            inputi[1].value = sveDestinacije[i][j].slike[1];
                            inputi[2].value = sveDestinacije[i][j].opis;
                            inputi[3].value = sveDestinacije[i][j].cena;
                            inputi[4].value = sveDestinacije[i][j].maxOsoba;
                            inputi[5].value = sveDestinacije[i][j].prevoz;
                            inputi[6].value = sveDestinacije[i][j].tip;

                            potvrdiDestinaciju.addEventListener("click", e => {
                                e.preventDefault();
                                validirajPodatkeDestinacije(sveDestinacije[i][j].slike, i, j, false);
                            })
                            break;
                        }
                    }
                }
            }else {
                window.open("../greska.html");
            }
        }
    }

    xhttp.open("GET", firebaseUrl + "/destinacije/" + ".json");
    xhttp.send();
}

var nazivDestinacije = formaIzmeneDestinacije[0];
var slikaDestinacije = formaIzmeneDestinacije[1];
var opisDestinacije = formaIzmeneDestinacije[2];
var cenaDestinacije = formaIzmeneDestinacije[3];
var maxOsobeDestinacije = formaIzmeneDestinacije[4];
var prevozDestinacije = formaIzmeneDestinacije[5];
var tipDestinacije = formaIzmeneDestinacije[6];

function validirajPodatkeDestinacije(listaSlika, idDestinacija, id, dodavanje) {
    let nazivD = nazivDestinacije.value.trim();
    let slikaD = slikaDestinacije.value.trim();
    let opisD = opisDestinacije.value.trim();
    let cenaD = cenaDestinacije.value.trim();
    let maxOsobeD = maxOsobeDestinacije.value.trim();
    let prevozD = prevozDestinacije.value.trim();
    let tipD = tipDestinacije.value.trim();
    let validno = true;

    if(nazivD === "") {
        validno = false;
        setError(nazivDestinacije, "Polje naziv je obavezno!");
    }else {
        setSuccess(nazivDestinacije);
    }
    if(slikaD === "") {
        validno = false;
        setError(slikaDestinacije, "Polje slika je obavezno!");
    }else {
        listaSlika.push(slikaD);
        setSuccess(slikaDestinacije);
    }
    if(opisD === "") {
        validno = false;
        setError(opisDestinacije, "Polje opis je obavezno!");
    }else {
        setSuccess(opisDestinacije);
    }
    if(cenaD === "") {
        validno = false;
        setError(cenaDestinacije, "Polje cena osnivanja je obavezno!");
    }else {
        setSuccess(cenaDestinacije);
    }
    if(maxOsobeD === "") {
        validno = false;
        setError(maxOsobeDestinacije, "Polje maksimalan broj osoba je obavezno!");
    }else {
        setSuccess(maxOsobeDestinacije);
    }
    if(prevozD === "") {
        validno = false;
        setError(prevozDestinacije, "Polje prevoz je obavezno!");
    }else {
        setSuccess(prevozDestinacije);
    }
    if(tipD == "") {
        validno = false;
        setError(tipDestinacije, "Polje tip je obavezno!");
    }else{
        setSuccess(tipDestinacije);
    }

    if(validno) {
        destinacija = {};
        destinacija.naziv = nazivD;
        destinacija.slike = listaSlika;
        destinacija.opis = opisD;
        destinacija.cena = cenaD;
        destinacija.maxOsoba = maxOsobeD;
        destinacija.prevoz = prevozD;
        destinacija.tip = tipD;

        if(dodavanje) {
            dodajDestinaciju(destinacija, idDestinacija);
        }else {
            izmenaDestinacije(destinacija, idDestinacija, id);
        }
    }
}
//Izmena podataka postojece destinacije
function izmenaDestinacije(destinacija, idDestinacija, id) {
    let sveDestinacije = {};
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveDestinacije = JSON.parse(xhttp.responseText);
                let popupIzmenaDestinacije = document.getElementById("popupIzmenaDestinacije");
                popupIzmenaDestinacije.classList.remove("active");
                ucitajAgencije();
            }else {
                window.open("../greska.html");
            }
        }
    }

    xhttp.open("PUT", firebaseUrl + "/destinacije/" + idDestinacija + "/" + id + ".json");
    xhttp.send(JSON.stringify(destinacija));
}
//Dodavanje nove destinacije
function dodajDestinaciju(destinacija, idDestinacija) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                let popup = document.getElementById("popupIzmenaDestinacije");
                popup.classList.remove("active");
                ucitajAgencije();
            }else {
                window.open("../greska.html");
            }
        }
    }

    xhttp.open("POST", firebaseUrl + "/destinacije/" + idDestinacija + ".json");
    xhttp.send(JSON.stringify(destinacija));
}
//Brisanje destinacije
function obrisiDestinaciju(idDestinacije, idDestinacija) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                ucitajAgencije();
                let popup = document.getElementById("popupDestinacije");
                popup.classList.remove("active");
                let popupUspeh = document.getElementById("popupUspeh");
                popupUspeh.classList.add("active");
            }
            else {
                window.open("../greska.html");
            }
        }
    }

    xhttp.open("DELETE", firebaseUrl + "/destinacije/" + idDestinacija + "/" + idDestinacije + ".json");
    xhttp.send();
}

// Izmena i validacija podataka agencije
var formaIzmene = document.getElementById("formaIzmene");
var potvrdi = formaIzmene.querySelector("button[type='submit']");
var nazivAgencije = formaIzmene[0];
var logoAgencije = formaIzmene[1];
var adresaAgencije = formaIzmene[2];
var godinaOsnivanjaAgencije = formaIzmene[3];
var telefonAgencije = formaIzmene[4];
var emailAgencije = formaIzmene[5];

potvrdi.addEventListener("click", e => {
    e.preventDefault();
    validirajPodatkeAgencije(potvrdi.getAttribute("id"));
})

var isValidEmail = emailAgencije => {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(emailAgencije).toLowerCase());
}

var isValidPhoneAgencije = telefonAgencije => {
    const re = /^\d{3}\/\d{4}-\d{5,9}$/;
    return re.test(String(telefonAgencije));
}

function validirajPodatkeAgencije(id) {
    let nazivA = nazivAgencije.value.trim();
    let logoA = logoAgencije.value.trim();
    let adresaA = adresaAgencije.value.trim();
    let godinaOsnivanjaA = godinaOsnivanjaAgencije.value.trim();
    let telefonA = telefonAgencije.value.trim();
    let emailA = emailAgencije.value.trim();
    let izmena = true;

    if(nazivA === "") {
        izmena = false;
        setError(nazivAgencije, "Polje naziv je obavezno!");
    }else {
        setSuccess(nazivAgencije);
    }
    if(logoA === "") {
        izmena = false;
        setError(logoAgencije, "Polje logo je obavezno!");
    }else {
        setSuccess(logoAgencije);
    }
    if(adresaA === "") {
        izmena = false;
        setError(adresaAgencije, "Polje adresa je obavezno!");
    }else {
        setSuccess(adresaAgencije);
    }
    if(godinaOsnivanjaA === "") {
        izmena = false;
        setError(godinaOsnivanjaAgencije, "Polje godina osnivanja je obavezno!");
    }else {
        setSuccess(godinaOsnivanjaAgencije);
    }
    if(telefonA === "") {
        izmena = false;
        setError(telefonAgencije, "Polje broj telefona je obavezno!");
    }else if(!isValidPhoneAgencije(telefonA)) {
        izmena = false;
        setError(telefonAgencije, "Pogresan format broja telefona")
    }else {
        setSuccess(telefonAgencije);
    }
    if(emailA === "") {
        izmena = false;
        setError(emailAgencije, "Polje email je obavezno!");
    }else if(!isValidEmail(emailA)) {
        izmena = false;
        setError(emailAgencije, "Pogresan format mail-a!");
    }else {
        setSuccess(emailAgencije);
    }

    if(izmena) {
        agencija = {};
        agencija.naziv = nazivA;
        agencija.logo = logoA;
        agencija.adresa = adresaA;
        agencija.godina = godinaOsnivanjaA;
        agencija.brojTelefona = telefonA;
        agencija.email = emailA;
        izmenaAgencije(agencija, id);
    }
}

function izmenaAgencije(agencija, id) {
    let izmenaRequest = new XMLHttpRequest();
    izmenaRequest.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                let popupIzmena = document.getElementById("popupIzmena");
                popupIzmena.classList.remove("active");
                ucitajAgencije();
            }else {
                window.open("../greska.html");
            }
        }
    }

    izmenaRequest.open("PUT", firebaseUrl + "/agencije/" + id + ".json");
    izmenaRequest.send(JSON.stringify(agencija));
}