var firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";

document.addEventListener("DOMContentLoaded", pronadjiAgenciju);

//unutar ovog bloka uzima se id koji je prosledjen sa predhodne stranice i preko njega odredjuje koja agencija se ucitava
    function nadjiId() {
        let lokacija = decodeURI(window.location.toString());
        let podeljenStr = lokacija.split("=");
        return podeljenStr[1];
    }

    function pronadjiAgenciju() {
        let id = nadjiId();
        let sveAgencije = {};
        let xhttpAgencije = new XMLHttpRequest();

        xhttpAgencije.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    sveAgencije = JSON.parse(xhttpAgencije.responseText);
                    for(let i in sveAgencije) {
                        if(id == sveAgencije[i].naziv) {
                            podesiAgenciju(sveAgencije[i]);
                            pronadjiDestinacije(sveAgencije[i].destinacije);
                            break;
                        }
                    }
                }
                else {
                    window.open("greska.html");
                }
            }
        }
        xhttpAgencije.open("GET", firebaseUrl + "/agencije/" + ".json");
        xhttpAgencije.send();
    }

//Unutar ovog bloka uredjuje se izgled stranice agencije
    function podesiAgenciju(agencija) {
        let logoAgencije = document.getElementById("logo");
        logoAgencije.src = agencija.logo;

        let nazivAgencije = document.getElementById("naslov");
        nazivAgencije.innerHTML = agencija.naziv;

        let opisAgencije = document.getElementById("opis");
        opisAgencije.innerHTML = "Adresa: " + agencija.adresa +"<br>" + "Godina: " + agencija.godina + "<br>" + "Telefon: "+ agencija.brojTelefona + "<br>" + "Email: " + agencija.email;
    }

    function pronadjiDestinacije(kljuc) {
        var sveDestinacije = {};
        var xhttpDestinacije = new XMLHttpRequest();

        xhttpDestinacije.onreadystatechange = function() {
            if(this.readyState == 4){
                if(this.status == 200){
                    sveDestinacije = JSON.parse(xhttpDestinacije.responseText);
                    for(let i in sveDestinacije) {
                        if(kljuc == i) {
                            ucitajDestinacije(sveDestinacije[i]);
                            break;
                        }
                    }
                }
            }
        }
        xhttpDestinacije.open("GET", firebaseUrl + "/destinacije/" + ".json");
        xhttpDestinacije.send();
    }

    function ucitajDestinacije(destinacije) {
        for(let i in destinacije) {
            var kolona = document.createElement("div");
            kolona.classList.add("col");

            var kartica = document.createElement("div");
            kartica.classList.add("card", "h-100");

            var slika = document.createElement("img");
            slika.classList.add("card-img", "img-fluid", "object-fit-cover", "h-100");
            slika.src = destinacije[i].slike[0];

            var ime = document.createElement("h5");
            ime.classList.add("card-title", "text-center");
            ime.innerHTML = destinacije[i].naziv;

            var link = document.createElement("a");
            link.classList.add("text-dark", "text-decoration-none", "selected");
            link.href = "destinacija.html?id=" + destinacije[i].naziv;

            kartica.appendChild(slika);
            kartica.appendChild(ime);
            link.appendChild(kartica);
            kolona.appendChild(link);

            var container = document.getElementsByClassName("row")[1];
            container.appendChild(kolona);
        }
    }