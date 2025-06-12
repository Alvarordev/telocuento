"use client";

import React, {
  useState,
  useEffect,
  useTransition,
  ChangeEvent,
  useRef,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import Image from "next/image";
import { createSupabaseClient } from "@/supabase/client";
import { uploadImage } from "@/supabase/storage/client";

interface Distrito {
  id: string;
  nombre: string;
}

interface Servicio {
  id: string;
  nombre: string;
}

interface CreateTeloFormProps {
  onTeloCreated?: () => void; // Callback opcional al crear un telo
}

export default function CreateTeloForm({ onTeloCreated }: CreateTeloFormProps) {
  const supabase = createSupabaseClient();

  const [teloName, setTeloName] = useState("");
  const [teloDescription, setTeloDescription] = useState("");
  const [teloLocation, setTeloLocation] = useState(""); 
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );
  const [teloPrices, setTeloPrices] = useState<
    Array<{ tipo: string; precio: number }>
  >([]); 
  const [teloTurns, setTeloTurns] = useState<
    Array<{ descripcion: string; duracion_horas: number; costo: number }>
  >([]); 

  const [imageFilesToUpload, setImageFilesToUpload] = useState<File[]>([]); 
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [districts, setDistricts] = useState<Distrito[]>([]);
  const [services, setServices] = useState<Servicio[]>([]);

  const [isPending, startTransition] = useTransition();
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitialData(true);
      try {
        const { data: districtsData, error: districtsError } = await supabase
          .from("distritos")
          .select("id, nombre");

        if (districtsError) throw districtsError;
        setDistricts(districtsData || []);

        const { data: servicesData, error: servicesError } = await supabase
          .from("servicios")
          .select("id, nombre");

        if (servicesError) throw servicesError;
        setServices(servicesData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, [supabase]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFilesToUpload((prev) => [...prev, ...filesArray]);

      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImageUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFilesToUpload((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setPreviewImageUrls((prev) => {
      const newUrls = prev.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prev[indexToRemove]); 
      return newUrls;
    });
    if (imageInputRef.current && imageFilesToUpload.length - 1 === 0) {
      imageInputRef.current.value = "";
    }
  };

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setSelectedServiceIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(serviceId);
      } else {
        newSet.delete(serviceId);
      }
      return newSet;
    });
  };

  const addPriceField = () =>
    setTeloPrices([...teloPrices, { tipo: "", precio: 0 }]);

  const removePriceField = (index: number) => {
    const newPrices = [...teloPrices];
    newPrices.splice(index, 1);
    setTeloPrices(newPrices);
  };

  const handlePriceChange = (
    index: number,
    field: "tipo" | "precio",
    value: string
  ) => {
    const newPrices = [...teloPrices];
    if (field === "precio") {
      newPrices[index].precio = parseFloat(value) || 0;
    } else {
      newPrices[index].tipo = value;
    }
    setTeloPrices(newPrices);
  };

  const addTurnField = () =>
    setTeloTurns([
      ...teloTurns,
      { descripcion: "", duracion_horas: 0, costo: 0 },
    ]);
  const removeTurnField = (index: number) => {
    const newTurns = [...teloTurns];
    newTurns.splice(index, 1);
    setTeloTurns(newTurns);
  };
  const handleTurnChange = (
    index: number,
    field: "descripcion" | "duracion_horas" | "costo",
    value: string
  ) => {
    const newTurns = [...teloTurns];
    if (field === "duracion_horas") {
      newTurns[index].duracion_horas = parseInt(value) || 0;
    } else if (field === "costo") {
      newTurns[index].costo = parseFloat(value) || 0;
    } else {
      newTurns[index].descripcion = value;
    }
    setTeloTurns(newTurns);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !teloName.trim() ||
      !teloDescription.trim() ||
      !teloLocation.trim() ||
      !selectedDistrictId
    ) {
      console.error(
        "Error: Por favor, completa todos los campos requeridos (Nombre, Descripción, Ubicación, Distrito)."
      );
      return;
    }

    if (imageFilesToUpload.length === 0) {
      console.error("Error: Debes seleccionar al menos una foto para el telo.");
      return;
    }

    startTransition(async () => {
      const uploadedImageUrls: string[] = [];

      try {
        for (const file of imageFilesToUpload) {
          const { imageUrl: uploadedUrl, error } = await uploadImage({
            file: file,
            bucket: "telocuento-pics",
          });

          if (error) {
            throw new Error(`Error al subir la imagen ${file.name}: ${error}`);
          }
          uploadedImageUrls.push(uploadedUrl!);
        }
        console.log(
          "Todas las imágenes subidas exitosamente:",
          uploadedImageUrls
        );

        const { data: teloData, error: teloError } = await supabase
          .from("telos")
          .insert({
            nombre: teloName.trim(),
            descripcion: teloDescription.trim(),
            ubicacion: teloLocation.trim(),
            distrito_id: selectedDistrictId,
            precios: teloPrices.length > 0 ? teloPrices : null,
            turnos: teloTurns.length > 0 ? teloTurns : null,
            fotos: uploadedImageUrls,
          })
          .select("id")
          .single();

        if (teloError) throw teloError;

        const newTeloId = teloData.id;

        if (selectedServiceIds.size > 0) {
          const teloServicesToInsert = Array.from(selectedServiceIds).map(
            (serviceId) => ({
              telo_id: newTeloId,
              servicio_id: serviceId,
            })
          );

          const { error: servicesError } = await supabase
            .from("telos_servicios")
            .insert(teloServicesToInsert);

          if (servicesError) throw servicesError;
        }

        console.log("Telo y servicios creados exitosamente:", newTeloId);

        setTeloName("");
        setTeloDescription("");
        setTeloLocation("");
        setSelectedDistrictId("");
        setSelectedServiceIds(new Set());
        setTeloPrices([]);
        setTeloTurns([]);
        setImageFilesToUpload([]);
        setPreviewImageUrls([]);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }

        onTeloCreated?.(); 
      } catch (error) {
        console.error("Error completo en la creación del telo:", error);
      }
    });
  };

  if (loadingInitialData) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Cargando datos iniciales (distritos y servicios)...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white space-y-6 my-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Crear Nuevo Telo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teloName">Nombre del Telo</Label>
            <Input
              id="teloName"
              type="text"
              value={teloName}
              onChange={(e) => setTeloName(e.target.value)}
              placeholder="Ej. Telo Oasis"
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teloLocation">Ubicación / Dirección</Label>
            <Input
              id="teloLocation"
              type="text"
              value={teloLocation}
              onChange={(e) => setTeloLocation(e.target.value)}
              placeholder="Ej. Av. Arequipa 123"
              disabled={isPending}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teloDescription">Descripción</Label>
          <Textarea
            id="teloDescription"
            value={teloDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setTeloDescription(e.target.value)
            }
            placeholder="Describe el telo, sus características, ambiente..."
            disabled={isPending}
            required
            rows={4}
          />
        </div>

        {/* Selector de Distrito */}
        <div className="space-y-2">
          <Label htmlFor="districtSelect">Distrito</Label>
          <Select
            value={selectedDistrictId}
            onValueChange={setSelectedDistrictId}
            disabled={isPending || districts.length === 0}
          >
            <SelectTrigger id="districtSelect">
              <SelectValue placeholder="Selecciona un distrito" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {districts.length === 0 && !loadingInitialData && (
            <p className="text-sm text-red-500">
              No hay distritos disponibles. Crea uno primero.
            </p>
          )}
        </div>

        {/* Sección de Servicios */}
        <div className="space-y-3 p-4 border rounded-md bg-gray-50">
          <Label className="text-lg font-medium text-gray-700 block mb-2">
            Servicios Ofrecidos
          </Label>
          {services.length === 0 && !loadingInitialData ? (
            <p className="text-sm text-red-500">
              No hay servicios disponibles. Crea uno primero.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={selectedServiceIds.has(service.id)}
                    onCheckedChange={(checked) =>
                      handleServiceChange(service.id, !!checked)
                    }
                    disabled={isPending}
                  />
                  <label
                    htmlFor={`service-${service.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service.nombre}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Precios (Dinámica) */}
        <div className="space-y-3 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-lg font-medium text-gray-700">Precios</Label>
            <Button
              type="button"
              onClick={addPriceField}
              disabled={isPending}
              variant="outline"
              size="sm"
            >
              Añadir Precio
            </Button>
          </div>
          {teloPrices.length === 0 && (
            <p className="text-sm text-gray-500">
              Añade al menos un tipo de precio.
            </p>
          )}
          {teloPrices.map((price, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label htmlFor={`price-type-${index}`} className="sr-only">
                  Tipo
                </Label>
                <Input
                  id={`price-type-${index}`}
                  type="text"
                  value={price.tipo}
                  onChange={(e) =>
                    handlePriceChange(index, "tipo", e.target.value)
                  }
                  placeholder="Ej. Cama King, Suite Junior"
                  disabled={isPending}
                  className="sm:text-sm"
                />
              </div>
              <div className="w-24 space-y-1">
                <Label htmlFor={`price-value-${index}`} className="sr-only">
                  Precio
                </Label>
                <Input
                  id={`price-value-${index}`}
                  type="number"
                  value={price.precio === 0 ? "" : price.precio}
                  onChange={(e) =>
                    handlePriceChange(index, "precio", e.target.value)
                  }
                  placeholder="S/."
                  disabled={isPending}
                  className="sm:text-sm"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removePriceField(index)}
                disabled={isPending}
              >
                Quitar
              </Button>
            </div>
          ))}
        </div>

        {/* Sección de Turnos (Dinámica) */}
        <div className="space-y-3 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-lg font-medium text-gray-700">Turnos</Label>
            <Button
              type="button"
              onClick={addTurnField}
              disabled={isPending}
              variant="outline"
              size="sm"
            >
              Añadir Turno
            </Button>
          </div>
          {teloTurns.length === 0 && (
            <p className="text-sm text-gray-500">Añade al menos un turno.</p>
          )}
          {teloTurns.map((turn, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label htmlFor={`turn-desc-${index}`} className="sr-only">
                  Descripción
                </Label>
                <Input
                  id={`turn-desc-${index}`}
                  type="text"
                  value={turn.descripcion}
                  onChange={(e) =>
                    handleTurnChange(index, "descripcion", e.target.value)
                  }
                  placeholder="Ej. Lunes a Viernes, Fin de Semana"
                  disabled={isPending}
                  className="sm:text-sm"
                />
              </div>
              <div className="w-24 space-y-1">
                <Label htmlFor={`turn-duration-${index}`} className="sr-only">
                  Duración (horas)
                </Label>
                <Input
                  id={`turn-duration-${index}`}
                  type="number"
                  value={turn.duracion_horas === 0 ? "" : turn.duracion_horas}
                  onChange={(e) =>
                    handleTurnChange(index, "duracion_horas", e.target.value)
                  }
                  placeholder="Hrs"
                  disabled={isPending}
                  className="sm:text-sm"
                />
              </div>
              <div className="w-24 space-y-1">
                <Label htmlFor={`turn-cost-${index}`} className="sr-only">
                  Costo
                </Label>
                <Input
                  id={`turn-cost-${index}`}
                  type="number"
                  value={turn.costo === 0 ? "" : turn.costo}
                  onChange={(e) =>
                    handleTurnChange(index, "costo", e.target.value)
                  }
                  placeholder="S/."
                  disabled={isPending}
                  className="sm:text-sm"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeTurnField(index)}
                disabled={isPending}
              >
                Quitar
              </Button>
            </div>
          ))}
        </div>

        {/* Sección de Carga de Fotos */}
        <div className="space-y-2 p-4 border rounded-md bg-gray-50">
          <Label htmlFor="teloPhotos">Fotos del Telo</Label>
          <Input
            id="teloPhotos"
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            disabled={isPending}
            className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {previewImageUrls.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {previewImageUrls.map((url, index) => (
                <div key={url} className="relative w-24 h-24">
                  <Image
                    src={url}
                    layout="fill"
                    objectFit="cover"
                    alt={`Preview ${index}`}
                    className="rounded-md shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full cursor-pointer"
                    onClick={() => removeImage(index)}
                    disabled={isPending}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}
          {imageFilesToUpload.length === 0 && (
            <p className="text-sm text-gray-500">
              Selecciona al menos una foto para tu telo.
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-3 text-lg font-semibold cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Creando Telo..." : "Crear Telo"}
        </Button>
      </form>
    </div>
  );
}
