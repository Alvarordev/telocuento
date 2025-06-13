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
import TelosCard from "./components/telos-card";
import { Checkbox } from "@/components/ui/checkbox";
import getTelos from "./services/getTelos";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import getDistritos, { Distrito } from "@/services/get-distritos";
import getServicios, { Servicios } from "@/services/get-servicios";
import {
  getFilteredTelos,
  Telo,
  TeloWithDistrictName,
} from "@/services/get-telos";

function TelosPage() {
  const [allTelos, setAllTelos] = useState<TeloWithDistrictName[] | Telo[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      try {
        const telosData = await getTelos();
        const distritosData = await getDistritos();
        const serviciosData = await getServicios();

        setAllTelos(telosData);
        setDistritos(distritosData.districts);
        setServicios(serviciosData.servicios);
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
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

  useEffect(() => {
    const handler = setTimeout(async () => {
      setError(null);
      try {
        const filteredTelos = await getFilteredTelos(
          Array.from(selectedDistritos),
          Array.from(selectedServicios)
        );
        setAllTelos(filteredTelos);
      } catch (err) {
        console.error("Error al filtrar telos:", err);
        setError("Error al aplicar filtros. Inténtalo de nuevo.");
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [selectedDistritos, selectedServicios]);

  const filteredAndSortedTelos = useMemo(() => {
    let currentTelos = [...allTelos];

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
  }, [allTelos, searchTerm, sortBy]);

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
      <div className="w-6xl mx-auto grid grid-cols-4 gap-4 my-10">
        <aside className="flex flex-col col-span-1 border border-gray-200 shadow-sm self-start">
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
                  />
                  <label
                    htmlFor={`district-${district.id}`}
                    className="text-sm cursor-pointer"
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
                  />
                  <label
                    htmlFor={`service-${servicio.id}`}
                    className="text-sm cursor-pointer"
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
              {allTelos.length} hotel(es)
            </p>

            <Select
              value={sortBy}
              onValueChange={(value: "a-z" | "z-a" | "rating" | "") =>
                setSortBy(value)
              }
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
          />

          <div className="grid grid-cols-2 grid-rows-3 gap-4 ">
            {filteredAndSortedTelos.map((telo) => (
              <TelosCard
                key={telo.id}
                telo={telo}
                district={distritos.find((d) => d.id === telo.distrito_id)!}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
export default TelosPage;
