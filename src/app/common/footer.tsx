import getDistritos from "@/services/get-distritos";
import { getServicios } from "@/services/get-servicios";
import { getTelos } from "@/services/get-telos";
import Link from "next/link";

async function Footer() {
  const distritos = await getDistritos();
  const hoteles = await getTelos();
  const comodidades = await getServicios();

  return (
    <footer className="flex flex-col justify-end bg-[#111827] text-white">
      <div className="w-6xl mx-auto flex py-8">
        <div className="grid grid-cols-4 gap-6 w-full">
          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">TeloCuento</h3>

            <p className="text-gray-300">Encuentra los mejores hostales en Lima</p>
          </div>

          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">Ubicaciones</h3>

            <ul>
              {distritos.districts.slice(0, 4).map((distrito) => (
                <li key={distrito.id} className="mb-2">
                  <Link
                    href={`/telos/${distrito.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Hoteles en {distrito.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">Más Vistos</h3>

            <ul>
              {hoteles.slice(0, 4).map((hotel) => (
                <li key={hotel.id} className="mb-2">
                  <Link
                    href={`/telos/${hotel.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {hotel.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col col-span-1">
            <h3 className="font-semibold text-lg mb-4">Comodidades</h3>

            <ul>
              {comodidades.servicios.slice(0, 4).map((comodidad) => (
                <li key={comodidad.id} className="mb-2">
                  <Link
                    href={`/telos/amenities/${comodidad.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {comodidad.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="w-6xl mx-auto py-4  text-center text-sm">
          © {new Date().getFullYear()} TeloCuento. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
