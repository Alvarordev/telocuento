// components/mobile-nav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react"; // Asumo que Bed es necesario aquí también
import { // Importa ChevronDown si quieres usarlo para el cambio de ícono
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Asegúrate de tener tu cn util

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

interface MobileNavProps {
  distritos: { id: string; nombre: string; slug: string }[];
  servicios: { id: string; nombre: string; slug: string }[];
}

const HEADER_HEIGHT_PX = 72;

function MobileNav({ distritos, servicios }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const distritoNavItems: NavItem = {
    title: "Distritos",
    items: distritos.map((d) => ({
      title: d.nombre,
      href: `/telos/${d.slug}`,
    })),
  };

  const serviciosNavItems: NavItem = {
    title: "Comodidades",
    items: servicios.map((s) => ({
      title: s.nombre,
      href: `/telos/amenities/${s.slug}`,
    })),
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed left-0 right-0 z-40 bg-background shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
          `top-[${HEADER_HEIGHT_PX}px]`, // Usamos la altura exacta del header
          isOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-full opacity-0 invisible"
        )}
        style={{
          maxHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
        }}
      >
        <ScrollArea className="h-full py-6 px-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/telos"
              className="px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Telos
            </Link>
            <Separator />

            <Collapsible className="px-2">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-base font-medium transition-all hover:underline group">
                {distritoNavItems.title}{" "}
                {/* Ícono dinámico: ChevronRight para cerrado, ChevronDown para abierto */}
                <span className="ml-auto"> {/* Contenedor para alinear el icono a la derecha */}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      "group-data-[state=closed]:block group-data-[state=open]:hidden" // Muestra ChevronRight cuando cerrado
                    )}
                  />
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      "group-data-[state=open]:block group-data-[state=closed]:hidden" // Muestra ChevronDown cuando abierto
                    )}
                  />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="flex flex-col pl-4 text-sm mt-2">
                  {distritoNavItems.items?.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href || "#"}
                      className="py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />

            <Collapsible className="px-2">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-base font-medium transition-all hover:underline group">
                {serviciosNavItems.title}{" "}
                {/* Ícono dinámico: ChevronRight para cerrado, ChevronDown para abierto */}
                <span className="ml-auto">
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      "group-data-[state=closed]:block group-data-[state=open]:hidden"
                    )}
                  />
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      "group-data-[state=open]:block group-data-[state=closed]:hidden"
                    )}
                  />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="flex flex-col pl-4 text-sm mt-2">
                  {serviciosNavItems.items?.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href || "#"}
                      className="py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default MobileNav;