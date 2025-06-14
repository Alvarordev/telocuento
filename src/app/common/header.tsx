import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bed } from "lucide-react";
import Link from "next/link";
import getDistritos from "../(landing)/services/getDistritos";
import { getServicios } from "@/services/get-servicios";

async function Header() {
  const distritos = await getDistritos()
  const servicios = await getServicios()

  return (
    <header className="flex w-full min-h-18 bg-white shadow-sm sticky">
      <div className="w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center font-bold text-2xl space-x-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600">
            <Bed className="w-4 h-4 text-white" />
          </div>
          <span className="text-purple-600">TeloCuento</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <Link href="/telos" className="text-base px-5">
              Telos
            </Link>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Distritos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    {distritos.districts.map((distrito) => (
                      <NavigationMenuLink asChild key={distrito.id}>
                        <Link href={`/telos/${distrito.slug}`}>{distrito.nombre}</Link>
                      </NavigationMenuLink>
                    ))}
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Comodidades</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    {servicios.servicios.map((comodidad) => (
                      <NavigationMenuLink asChild key={comodidad.id}>
                        <Link href={`/telos/amenities/${comodidad.slug}`}>{comodidad.nombre}</Link>
                      </NavigationMenuLink>
                    ))}
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

export default Header;
