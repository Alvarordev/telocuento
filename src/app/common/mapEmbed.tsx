interface TeloMapEmbedProps {
  address: string; // La dirección del telo (ej. "Sta. Teresita 79, Gualeguaychú, Entre Ríos")
  width?: string;
  height?: string;
}

export default function MapEmbed({ address, width = '100%', height = '400px'}: TeloMapEmbedProps) {
  const encodedAddress = encodeURIComponent(address);

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`;

  return (
    <div style={{ width: width, height: height, overflow: 'hidden', borderRadius: '8px' }}>
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${address}`}
      ></iframe>
    </div>
  );
}