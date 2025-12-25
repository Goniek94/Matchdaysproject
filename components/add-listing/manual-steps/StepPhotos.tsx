"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, Plus, Trash2 } from "lucide-react";

// Lokalny komponent uploadera (można go wynieść do osobnego pliku UI)
const PhotoBox = ({ label, imageUrl, onUpload, required = false }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => !imageUrl && inputRef.current?.click()}
      className={`relative aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden bg-gray-50 hover:bg-white
      ${
        imageUrl
          ? "border-solid border-gray-300"
          : "border-gray-300 hover:border-black"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] &&
          onUpload(URL.createObjectURL(e.target.files[0]))
        }
      />
      {imageUrl ? (
        <>
          <Image src={imageUrl} alt={label} fill className="object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white"
          >
            <Camera size={16} />
          </button>
        </>
      ) : (
        <div className="p-2 text-gray-400">
          <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <span className="text-xs font-bold uppercase">{label}</span>
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
    </div>
  );
};

export default function StepPhotos({ data, updateData }: any) {
  // Helper do aktualizacji konkretnego zdjęcia obowiązkowego
  const setMandatory = (key: string, url: string) => {
    updateData("mandatoryPhotos", { ...data.mandatoryPhotos, [key]: url });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black">Photo Evidence</h2>
        <p className="text-gray-500">
          We need 4 key photos to verify your item.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <PhotoBox
          label="Full Front"
          imageUrl={data.mandatoryPhotos.front}
          onUpload={(url: string) => setMandatory("front", url)}
          required
        />
        <PhotoBox
          label="Full Back"
          imageUrl={data.mandatoryPhotos.back}
          onUpload={(url: string) => setMandatory("back", url)}
          required
        />
        <PhotoBox
          label="Crest / Logo"
          imageUrl={data.mandatoryPhotos.crest}
          onUpload={(url: string) => setMandatory("crest", url)}
          required
        />
        <PhotoBox
          label="Tags / Code"
          imageUrl={data.mandatoryPhotos.tags}
          onUpload={(url: string) => setMandatory("tags", url)}
          required
        />
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus className="bg-black text-white rounded-full p-1" size={24} />
          Extras (Defects, Details)
        </h3>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {data.extraPhotos.map((url: string, idx: number) => (
            <div
              key={idx}
              className="aspect-square relative rounded-xl overflow-hidden group"
            >
              <Image src={url} alt="Extra" fill className="object-cover" />
              <button
                onClick={() => {
                  const newExtras = data.extraPhotos.filter(
                    (_: any, i: number) => i !== idx
                  );
                  updateData("extraPhotos", newExtras);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
            <Plus className="text-gray-300" />
            <span className="text-[10px] font-bold text-gray-400 mt-1">
              ADD
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files).map((f) =>
                    URL.createObjectURL(f)
                  );
                  updateData("extraPhotos", [...data.extraPhotos, ...newFiles]);
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
