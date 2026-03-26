import './style.scss'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'


const API_IPIFY = 'https://api.ipify.org?format=json'; // senin ip ne ?
const API_GEOLOCATION = 'https://api.ipgeolocation.io/ipgeo?apiKey=add46e1145b4451b93d65313fc9398c4'; // ip'nin konumu nerede?

const searchbtn = document.getElementById("btn-src");
let map = null; // Global harita değişkeni

document.addEventListener('DOMContentLoaded', function() {
            loadmap();
        });

function loadmap(){
    
    fetch(`${API_GEOLOCATION}`)
    .then(response => response.json())
    .then(data => {
        update(data);
        initmap(data.latitude,data.longitude);
    })
    .catch(error => {
        console.error("Error fetching geolocation data:", error);
        alert("An error occurred while fetching geolocation data. Please try again.");

    });

}



function update(data){
    const { ip, city, state_prov,isp } = data;
    const timeStr = data.time_zone.current_time; // "2026-03-25 11:53:36.102+0300"

    // HH:MM
    const hhmm = timeStr.split(" ")[1].slice(0, 5); // "11:53"

    document.getElementById("ip").textContent = ip;
    document.getElementById("location").textContent = `${city}, ${state_prov}`;
    document.getElementById("timezone").textContent = `UTC + ${hhmm}`;
    document.getElementById("isp").textContent = isp;
    
}

function initmap(lat, lon){
    //önce haritamızı temizliyoruz
    if(map){
        map.remove();
    }

    map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon], { icon: myIcon }).addTo(map); // ikon resmini değiştirmek için myıcon tanımladım ve markerin olduğu bu kısma yerleştirdim.
 
}



searchbtn.addEventListener("click", function () {
  const ipaddress = document.getElementById("ip-search").value.trim();

    if (ipaddress === "") {
        alert("please enter a valid IP address");
        return;
    }

    fetch(`${API_GEOLOCATION}&ip=${ipaddress}`)
    .then(response => response.json())
    .then(data => {
        update(data);
        initmap(data.latitude,data.longitude);
    })

    .catch(error => {
        console.error("Error fetching geolocation data:", error);
        alert("An error occurred while fetching geolocation data. Please try again.");
    });


});

const myIcon = L.icon({ // ikon resmi ekmek için yazılan script
  iconUrl: '/public/images/marker-icon-2x.png', 
  iconSize:     [41, 50], 
  iconAnchor:   [16, 32],
})

