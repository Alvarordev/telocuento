"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertBlobUrlToFile } from "@/lib/utils";
import { createSupabaseClient } from "@/supabase/client";
import { uploadImage } from "@/supabase/storage/client";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";

function UploadDistrito() {
  const [districtName, setDistrictName] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [teloSlug, setTeloSlug] = useState(''); 

  const supabase = createSupabaseClient();

  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistrictName(e.target.value);
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageUrls = files.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };


  const [isPending, startTransition] = useTransition();

  const handleClickUpload = () => {
    startTransition(async () => {
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "telocuento-pics",
        });

        if (error) {
          console.error(error);
          return;
        }

        handleCreateDistrict(imageUrl!);
      }

      setImageUrls([]);
      setDistrictName("");
    });
  };

  const handleCreateDistrict = async (imageUrl: string) => {
    if (!imageUrl || !districtName) {
      console.error("Image URL or district name is missing.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("distritos")
        .insert({
          nombre: districtName.toLocaleLowerCase(),
          foto: imageUrl,
          slug: teloSlug
        })
        .select();

      console.log(data);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[ñ]/g, 'n') // Reemplaza ñ por n
      .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres especiales (excepto letras, números, espacios, guiones)
      .replace(/\s+/g, '-') // Reemplaza espacios con guiones
      .replace(/-+/g, '-'); // Reemplaza múltiples guiones con uno solo
  };

    useEffect(() => {
      if (districtName.trim() !== '') {
        setTeloSlug(generateSlug(districtName));
      } else {
        setTeloSlug('');
      }
    }, [districtName]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Distrito</h1>
      <Input type="file" ref={imageInputRef} onChange={handleImageChange} />

      <Input
        type="text"
        placeholder="Nombre del distrito"
        value={districtName}
        onChange={handleNameChange}
      />

      <div className="space-y-2">
          <Label htmlFor="teloSlug">Slug (URL amigable)</Label>
          <Input
            id="teloSlug"
            type="text"
            value={teloSlug}
            onChange={(e) => setTeloSlug(e.target.value)} // Permite al usuario editarlo
            placeholder="ej-telo-oasis-miraflores"
            disabled={isPending}
            required
          />
          <p className="text-sm text-gray-500">Se generará automáticamente, pero puedes modificarlo.</p>
        </div>

      <div className="flex gap-4">
        {imageUrls.map((url, index) => (
          <Image
            key={url}
            src={url}
            width={300}
            height={300}
            alt={`img-${index}`}
          />
        ))}
      </div>

      <Button onClick={handleClickUpload} disabled={isPending}>
        {isPending ? "Creando..." : "Crear"}
      </Button>
    </div>
  );
}

export default UploadDistrito;
