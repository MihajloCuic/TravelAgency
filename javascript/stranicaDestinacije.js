var firebaseurl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";

document.addEventListener("DOMContentLoaded", nadjiDestinaciju);

function nadjiId() {
    let lokacija = decodeURI(window.location.toString());
    let podeljenStr = lokacija.split("=");
    return podeljenStr[1];
}

function nadjiDestinaciju() {
    let id = nadjiId();
    let sveDestinacije = {};
    let xhttpDestinacije = new XMLHttpRequest();
    xhttpDestinacije.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    sveDestinacije = JSON.parse(xhttpDestinacije.responseText);
                    for(let i in sveDestinacije) {
                        for(let j in sveDestinacije[i]) {
                            if(id == sveDestinacije[i][j].naziv) {
                                ucitajCarousel(sveDestinacije[i][j]);
                                ucitajDestinaciju(sveDestinacije[i][j]);
                                break;
                            }
                        }
                    }
                }
                else {
                    window.open("greska.html");
                }
            }
    }
    xhttpDestinacije.open("GET", firebaseurl + "/destinacije/" + ".json");
    xhttpDestinacije.send();
}

//Ucitavanje slika unutar carousel-a
function ucitajCarousel(destinacija) {
    var sveSlike = destinacija.slike;
    for(let i = 0; i<sveSlike.length; i++) {
        let carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        let slika = document.createElement("img");
        slika.classList.add("img-fluid", "object-fit-cover", "d-block", "w-100");
        slika.src = destinacija.slike[i];

        let carouselInner = document.getElementsByClassName("carousel-inner")[0];
        carouselItem.appendChild(slika);
        carouselInner.appendChild(carouselItem);
    }

    document.getElementsByClassName("carousel-item")[1].classList.add("active");
    
}

//popunjavanje elemenata podacima destinacije iz baze
function ucitajDestinaciju(destinacija) {
    let naslov = document.getElementById("naslov");
    naslov.innerHTML = destinacija.naziv;

    let prevozDoDestinacije = document.getElementById("prevoz");
    prevozDoDestinacije.innerHTML = "prevoz: " + destinacija.prevoz;

    let brojOsoba = document.getElementById("brojOsoba");
    brojOsoba.innerHTML = "Maksimalan broj osoba: " + destinacija.maxOsoba;

    let cenaDestinacije = document.getElementById("cena");
    cenaDestinacije.innerHTML = "Cena: " + destinacija.cena + "din/osobi";

    let opisDestinacije = document.getElementById("opis");
    opisDestinacije.innerHTML = destinacija.opis;
}

