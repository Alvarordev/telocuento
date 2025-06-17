"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import getDistritos, { Distrito } from "@/services/get-distritos";
import { getServicios, Servicios } from "@/services/get-servicios";
import {
  getTelosWithDistrict,
  Telo,
  TeloWithDistrictName,
} from "@/services/get-telos";
import Container from "@/app/common/container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import TelosGrid from "../../components/telos-grid";

function AmenitiesPage() {
  const params = useParams();
  const service = typeof params.service === "string" ? params.service : "";

  const [allTelos, setAllTelos] = useState<TeloWithDistrictName[] | Telo[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState<Servicios>();

  const [selectedDistritos, setSelectedDistritos] = useState<Set<string>>(
    new Set()
  );
  const [selectedServicios, setSelectedServicios] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"a-z" | "z-a" | "rating" | "">("");

  useEffect(() => {
    async function loadInitialDataAndSetFilter() {
      setError(null);
      try {
        const distritosData = await getDistritos();
        const serviciosData = await getServicios();

        setDistritos(distritosData.districts);
        setServicios(serviciosData.servicios);

        const initialSelectedServicesSet = new Set<string>();
        let foundService: Servicios | undefined;

        if (service) {
          foundService = serviciosData.servicios.find(
            (s) => s.slug === service
          );
          if (foundService) {
            initialSelectedServicesSet.add(foundService.id);
            setServiceData(foundService);
          }
        }

        setSelectedServicios(initialSelectedServicesSet);

        const telosData = await getTelosWithDistrict(
          Array.from(selectedDistritos),
          Array.from(initialSelectedServicesSet)
        );
        setAllTelos(telosData);
      } catch (err) {
        console.error("Error al cargar datos iniciales o aplicar filtro:", err);
        setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      }
    }
    loadInitialDataAndSetFilter();
  }, [service, selectedDistritos]);

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
    if (service && serviceId === serviceData!.id && !checked) {
      return;
    }

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
        const filteredTelos = await getTelosWithDistrict(
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
      <div className="flex flex-col px-2 md:px-0 md:w-6xl mx-auto md:grid grid-cols-4 gap-4 my-10">
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
          <Link
            href="/telos"
            className="flex space-x-2 items-center text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="underline">Ver todos los hoteles</span>
          </Link>
          <h1 className="text-3xl font-bold">
            Telos con {serviceData?.nombre}
          </h1>
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

          <TelosGrid telos={filteredAndSortedTelos} distritos={distritos} />
        </div>
      </div>
    </Container>
  );
}
export default AmenitiesPage;
