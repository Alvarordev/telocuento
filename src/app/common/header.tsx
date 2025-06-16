// components/header.tsx
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
import { getServicios } from "@/services/get-servicios"; 

import MobileNav from "./mobile-nav";
import getDistritos from "@/services/get-distritos";

async function Header() {
  const distritosData = await getDistritos();
  const serviciosData = await getServicios();

  const distritos = distritosData.districts.map((d) => ({
    id: d.id,
    nombre: d.nombre,
    slug: d.slug,
  }));
  const servicios = serviciosData.servicios.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    slug: s.slug,
  }));

  if (!distritos || !servicios) {
    return
  }

  return (
    <header className="flex w-full min-h-18 bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link
          href="/"
          className="flex items-center font-bold text-2xl space-x-2"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600">
            <Bed className="w-4 h-4 text-white" />
          </div>
          <span className="text-purple-600">TeloCuento</span>
        </Link>
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <Link href="/telos" className="text-base px-5">
              Telos
            </Link>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Distritos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4">
                  {distritos.map((distrito) => (
                    <li key={distrito.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/telos/${distrito.slug}`}
                          className="block p-2 rounded-md hover:bg-gray-100 text-sm"
                        >
                          {distrito.nombre}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Comodidades</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4">
                  {servicios.map((comodidad) => (
                    <li key={comodidad.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/telos/amenities/${comodidad.slug}`}
                          className="block p-2 rounded-md hover:bg-gray-100 text-sm"
                        >
                          {comodidad.nombre}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <MobileNav distritos={distritos} servicios={servicios} />
      </div>
    </header>
  );
}

export default Header;
