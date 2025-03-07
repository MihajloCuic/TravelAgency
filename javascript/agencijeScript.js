var firebaseUrl = "https://turistrickeagencije-default-rtdb.europe-west1.firebasedatabase.app";

document.addEventListener("DOMContentLoaded", ucitaj);

function ucitaj(){
    var sveAgencije = {};
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                sveAgencije = JSON.parse(xhttp.responseText);
                for(let i in sveAgencije){
                    let agencija = sveAgencije[i];
                    ucitajStranicuAgencije(agencija);
                }
            }
            else {
                window.open("greska.html");
            }
        }
        
    }
    xhttp.open("GET", firebaseUrl + "/agencije/" + ".json");
    xhttp.send();
}

function ucitajStranicuAgencije(agencija) {
    let kolona = document.createElement("div");
    kolona.classList.add("col");

    let kartica = document.createElement("div");
    kartica.classList.add("card", "h-100");
    kartica.setAttribute("data-bs-theme", "dark");

    let slika = document.createElement("img");
    slika.classList.add("card-img-top", "object-fit-cover", "h-100");
    slika.src = agencija.logo;

    let naslov = document.createElement("h5");
    naslov.classList.add("card-title", "text-center");
    naslov.innerHTML = agencija.naziv;

    let link = document.createElement("a");
    link.classList.add("text-dark", "text-decoration-none", "selected");
    link.href = "agencija.html?id=" + agencija.naziv;

    kartica.appendChild(slika);
    kartica.appendChild(naslov);
    link.appendChild(kartica);
    kolona.appendChild(link);

    let red = document.getElementsByClassName("row")[0];
    red.appendChild(kolona);
}
