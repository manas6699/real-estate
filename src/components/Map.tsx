'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Required for Leaflet styling
import L from 'leaflet';



// Fix for default icon issue with Leaflet + Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function CustomMap() {
    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <MapContainer center={[22.5010, 88.3268]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[22.5726, 88.3639]}>
                    <Popup>
                        Welcome to Morya 🏙️ <br /> 
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
