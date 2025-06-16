"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Distrito } from "@/services/get-distritos";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter para la navegación

interface DistrictPickerProps {
  distritos: Distrito[];
}

export const DistrictPicker = ({ distritos }: DistrictPickerProps) => {
  const [selectDistrictSlug, setSelectDistrictSlug] = useState<string>("");
  const router = useRouter();

  const handleDistrictChange = (value: string) => {
    setSelectDistrictSlug(value);
  };

  const handleSearchClick = () => {
    if (selectDistrictSlug) {
      router.push(`/telos/${selectDistrictSlug}`);
    }
  };

  return (
    <div className="flex">
      <Select value={selectDistrictSlug} onValueChange={handleDistrictChange}>
        <SelectTrigger className="w-full text-base bg-white text-foreground">
          <SelectValue placeholder="Distrito" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {distritos.map((district) => (
              <SelectItem key={district.id} value={district.slug}>
                {district.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        variant="secondary"
        onClick={handleSearchClick} // Asigna la función al click del botón
        className="cursor-pointer ml-4 text-base bg-primary-foreground px-8 font-semibold hover:bg-primary hover:text-background"
      >
        Buscar
      </Button>
    </div>
  );
};
