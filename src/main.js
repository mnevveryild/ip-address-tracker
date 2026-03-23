import './style.scss'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const IPIFY_KEY = import.meta.env.VITE_IPIFY_KEY
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY

if (!IPIFY_KEY) throw new Error('VITE_IPIFY_KEY eksik (.env)')
if (!MAPTILER_KEY) throw new Error('VITE_MAPTILER_KEY eksik (.env)')

const mapEl = document.getElementById('map')
if (!mapEl) throw new Error('index.html içinde #map bulunamadı. <div id="map"></div> ekle.')

// Başlangıçta “nötr” görünüm: dünya
const map = L.map(mapEl).setView([20, 0], 2)

L.tileLayer(
  `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
  {
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; MapTiler',
  }
).addTo(map)

const markerIcon = L.icon({
  iconUrl: '/images/icon-location.svg',
  iconSize: [46, 56],
  iconAnchor: [23, 56],
})

let marker = null

async function fetchMyLocation() {
  const url = new URL('https://geo.ipify.org/api/v2/country,city')
  url.searchParams.set('apiKey', IPIFY_KEY)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`IPify isteği başarısız: ${res.status}`)
  return res.json()
}

async function init() {
  const data = await fetchMyLocation()
  const { lat, lng } = data.location

  map.setView([lat, lng], 13, { animate: true })

  marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map)
}

init().catch((err) => {
  console.error(err)
  alert(err?.message || 'Konum alınamadı.')
})