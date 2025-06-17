"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Container from "../common/container";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import getDistritos, { Distrito } from "@/services/get-distritos";
import { Servicios, getServicios } from "@/services/get-servicios";
import { getTelosWithServices, Telo } from "@/services/get-telos";
import TelosGrid from "./components/telos-grid";

function TelosPage() {
  const [initialTelos, setInitialTelos] = useState<Telo[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDistritos, setSelectedDistritos] = useState<Set<string>>(
    new Set()
  );
  const [selectedServicios, setSelectedServicios] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"a-z" | "z-a" | "rating" | "">("");

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
        console.error("Error al cargar datos iniciales:", err);
        setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleDistrictChange = (districtId: string, checked: boolean) => {
    setSelectedDistritos((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(districtId);
      } else {
        newSet.delete(districtId);
      }
      return newSet;
    });
  };

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
    if (selectedDistritos.size > 0) {
      currentTelos = currentTelos.filter((telo) =>
        selectedDistritos.has(telo.distrito_id)
      );
    }

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
  }, [initialTelos, searchTerm, sortBy, selectedDistritos, selectedServicios]);

  if (error) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64 text-red-600">
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col px-4  md:w-6xl mx-auto md:grid md:grid-cols-4 gap-4 my-10">
        <aside className="hidden md:flex flex-col col-span-1 border border-gray-200 shadow-sm self-start">
          <div className="p-4">
            <p className="font-semibold pb-3">Ubicación</p>
            <ul className="flex flex-col gap-1">
              {distritos.map((district) => (
                <li className="flex gap-2 items-center" key={district.id}>
                  <Checkbox
                    id={`district-${district.id}`}
                    checked={selectedDistritos.has(district.id)}
                    onCheckedChange={(checked) =>
                      handleDistrictChange(district.id, !!checked)
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`district-${district.id}`}
                    className={`text-sm cursor-pointer ${
                      isLoading ? "text-gray-400" : ""
                    }`}
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
          <h1 className="text-3xl font-bold">Telos en Lima</h1>
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

export default TelosPage;
