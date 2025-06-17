"use client"; // ¡IMPORTANTE! Convierte este componente en un Client Component

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Telo } from "@/services/get-telos";
import type { Distrito } from "@/services/get-distritos";
import { getServicios, type Servicios } from "@/services/get-servicios";
import { getTelosWithServices } from "@/services/get-telos"; 
import getDistritos from "@/services/get-distritos";

import Container from "@/app/common/container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TelosGrid from "../components/telos-grid";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface DistrictPageProps {
  params: {
    district: string; 
  };
}

function DistrictPage({ params }: DistrictPageProps) {
  const [initialTelos, setInitialTelos] = useState<Telo[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedServicios, setSelectedServicios] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"a-z" | "z-a" | "rating" | "">("");

  const { district: currentDistrictSlug } = params;

  useEffect(() => {
    async function loadInitialData() {
      setError(null);
      setIsLoading(true);
      try {
        const [telosData, distritosData, serviciosData] = await Promise.all([
          getTelosWithServices(),
          getDistritos(),
          getServicios(),
        ]);

        setInitialTelos(telosData);
        setDistritos(distritosData.districts);
        setServicios(serviciosData.servicios);
      } catch (err) {
        console.error("Error al cargar datos iniciales en DistrictPage:", err);
        setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []); 

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setSelectedServicios((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(serviceId);
      } else {
        newSet.delete(serviceId);
      }
      return newSet;
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAndSortedTelos = useMemo(() => {
    let currentTelos = [...initialTelos];

    currentTelos = currentTelos.filter(
      (telo) =>
        distritos.find((d) => d.id === telo.distrito_id)?.slug ===
        currentDistrictSlug
    );

    if (selectedServicios.size > 0) {
      currentTelos = currentTelos.filter((telo) =>
        Array.from(selectedServicios).every((serviceId) =>
          telo.servicios_relacion?.some((s) => s.servicio_id === serviceId)
        )
      );
    }

    if (searchTerm.trim() !== "") {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentTelos = currentTelos.filter(
        (telo) =>
          telo.nombre.toLowerCase().includes(lowercasedSearchTerm) ||
          telo.ubicacion.toLowerCase().includes(lowercasedSearchTerm) ||
          telo.descripcion.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    if (sortBy === "a-z") {
      currentTelos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortBy === "z-a") {
      currentTelos.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (sortBy === "rating") {
      currentTelos.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    }

    return currentTelos;
  }, [initialTelos, currentDistrictSlug, searchTerm, sortBy, selectedServicios, distritos]);
  const districtData = distritos.find((d) => d.slug === currentDistrictSlug);

  if (error) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64 text-red-600">
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (!isLoading && !districtData) {
    return (
      <Container>
        <div className="text-center w-6xl mx-auto py-10">
          <h1 className="text-3xl font-bold">Distrito no encontrado</h1>
          <p className="text-gray-500">
            Lo sentimos, no pudimos encontrar el distrito solicitado.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col px-2 md:w-6xl mx-auto md:grid grid-cols-4 gap-4 my-10">
        <aside className="hidden md:flex flex-col col-span-1 border border-gray-200 shadow-sm self-start">
          <div className="p-4">
            <p className="font-semibold pb-3">Ubicación</p>
            <ul className="flex flex-col gap-1">
              {distritos.map((district) => (
                <li className="flex gap-2 items-center" key={district.id}>
                  <Checkbox
                    id={`district-${district.id}`}
                    checked={district.slug === currentDistrictSlug}
                    disabled={true} 
                  />
                  <label
                    htmlFor={`district-${district.id}`}
                    className="text-sm cursor-not-allowed text-gray-500"
                  >
                    {district.nombre}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4">
            <p className="font-semibold pb-3">Servicios</p>
            <ul className="flex flex-col gap-1">
              {servicios.map((servicio) => (
                <li className="flex gap-2 items-center" key={servicio.id}>
                  <Checkbox
                    id={`service-${servicio.id}`}
                    checked={selectedServicios.has(servicio.id)}
                    onCheckedChange={(checked) =>
                      handleServiceChange(servicio.id, !!checked)
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`service-${servicio.id}`}
                    className={`text-sm cursor-pointer ${
                      isLoading ? "text-gray-400" : ""
                    }`}
                  >
                    {servicio.nombre}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="col-span-3 flex flex-col gap-4">
          <Link
            href="/telos"
            className="flex space-x-2 items-center text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="underline">Ver todos los hoteles</span>
          </Link>
          <h1 className="text-3xl font-bold">
            Telos en {districtData?.nombre || currentDistrictSlug}
          </h1>{" "}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-base">
              {isLoading
                ? "Cargando..."
                : `${filteredAndSortedTelos.length} hotel(es)`}{" "}
            </p>

            <Select
              value={sortBy}
              onValueChange={(value: "a-z" | "z-a" | "rating" | "") =>
                setSortBy(value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a-z">Nombre (A-Z)</SelectItem>
                <SelectItem value="z-a">Nombre (Z-A)</SelectItem>
                <SelectItem value="rating">Mejor calificación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Buscar por nombre, ubicación o descripción" 
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={isLoading}
          />

          <TelosGrid
            telos={filteredAndSortedTelos}
            distritos={distritos} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </Container>
  );
}
export default DistrictPage;