var firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";

document.addEventListener("DOMContentLoaded", ucitaj);

function ucitaj() {
    let sveDestinacije = {};
    let xhttpDestinacije = new XMLHttpRequest();

    xhttpDestinacije.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveDestinacije = JSON.parse(xhttpDestinacije.responseText);
                for(let i in sveDestinacije) {
                    for(let j in sveDestinacije[i]) {
                        if(sveDestinacije[i][j].tip == "Gradovi Evrope") {
                            ucitajGradoveEvrope(sveDestinacije[i][j]);
                        }
                    }
                }
            }
            else {
                window.open("../greska.html");
            }
        }
    }
    xhttpDestinacije.open("GET", firebaseUrl + "/destinacije/" + ".json");
    xhttpDestinacije.send();
}

function ucitajGradoveEvrope(destinacija) {
    let provera = document.getElementsByTagName("h4");
    for(let p of provera) {
        if(p.innerHTML == destinacija.naziv){
            return;
        }
    }

    let kolona = document.createElement("div");
    kolona.classList.add("col");

    let kartica = document.createElement("div");
    kartica.classList.add("card", "h-100");

    let slika = document.createElement("img");
    slika.classList.add("img-fluid", "object-fit-cover", "h-100", "rounded-top-2");
    slika.src = destinacija.slike[0];

    let naslov = document.createElement("h4");
    naslov.classList.add("text-center");
    naslov.innerHTML = destinacija.naziv;

    let link = document.createElement("a");
    link.classList.add("text-decoration-none");
    link.href = "../destinacija.html?id=" + destinacija.naziv;

    kartica.appendChild(slika);
    kartica.appendChild(naslov);
    link.appendChild(kartica);
    kolona.appendChild(link);

    let container = document.getElementsByClassName("row")[0];
    container.appendChild(kolona);
}