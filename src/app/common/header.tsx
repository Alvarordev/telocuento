import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

function Header() {
  const distritos = [
    {
      id: 1,
      name: "Ate",
      image: "/ate.jpg",
    },
    {
      id: 2,
      name: "Barranco",
      image: "/barranco.jpg",
    },
    {
      id: 3,
      name: "Breña",
      image: "/brena.jpg",
    },
    {
      id: 4,
      name: "Callao",
      image: "/callao.jpg",
    },
    {
      id: 5,
      name: "Chorrillos",
      image: "/chorrillos.jpg",
    },
    {
      id: 6,
      name: "Comas",
      image: "/comas.jpg",
    },
    {
      id: 7,
      name: "Jesús María",
      image: "/jesus-maria.jpg",
    },
    {
      id: 8,
      name: "La Molina",
      image: "/la-molina.jpg",
    },
    {
      id: 9,
      name: "La Victoria",
      image: "/la-victoria.jpg",
    },
  ];

  const comodidades = [
    {
      id: 1,
      name: "Wifi",
      image: "/wifi.jpg",
    },
    {
      id: 2,
      name: "Desayuno",
      image: "/desayuno.jpg",
    },
    {
      id: 3,
      name: "Estacionamiento",
      image: "/estacionamiento.jpg",
    },
    {
      id: 4,
      name: "Piscina",
      image: "/piscina.jpg",
    },
  ]

  return (
    <header className="flex w-full min-h-18 bg-white shadow-sm sticky">
      <div className="w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-2xl">TeloCuento</div>

        <NavigationMenu>
          <NavigationMenuList>
            <Link href="/telos" className="text-sm px-5">Telos</Link>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Distritos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    {distritos.map((distrito) => (
                      <NavigationMenuLink asChild key={distrito.id}>
                        <Link href="#">{distrito.name}</Link>
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
                    {comodidades.map((comodidad) => (
                      <NavigationMenuLink asChild key={comodidad.id}>
                        <Link href="#">{comodidad.name}</Link>
                      </NavigationMenuLink>
                    ))}
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <Link href="/" className="text-sm px-5">Blog</Link>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

export default Header;
