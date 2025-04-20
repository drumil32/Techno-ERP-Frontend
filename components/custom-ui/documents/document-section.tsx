import React from "react";
import { Upload, X } from "lucide-react";
import { AddMoreDataBtn } from "../add-more-data-btn/add-data-btn";

type SubjectMaterial = {
  name: string;
  link: string;
  metadata: Record<string, string>;
};

type Props = { 
  materials: SubjectMaterial[];
  onRemove: (index: number) => void;
  onUpload: () => void;
  nameFontSize?: string;
  metadataFontSize?: string;
};

export default function SubjectMaterialsSection({
  materials,
  onRemove,
  onUpload,
  nameFontSize = "text-sm",
  metadataFontSize = "text-xs",
}: Props) {
  return (

    <div className="w-full mb-10 bg-white space-y-4 my-[16px] px-4 py-3 shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="flex w-full items-center py-2 px-1">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">Subject Materials</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {materials.map((material, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-3 py-2 border-box rounded-md bg-white shadow-sm hover:shadow-md transition`}
            style={{
              minWidth: "243px",
              maxWidth: "350px",
              minHeight: "50px",
              paddingRight: "0.5rem",
            }}
          >
            <div className="flex flex-col overflow-hidden pr-2">
              <a
                href={material.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-inter documentHeading truncate hover:underline ${nameFontSize}`}
              >
                {material.name}
              </a>
              <span
                className={`documentMetaDataText font-inter truncate pt-1 ${metadataFontSize}`}
                title={Object.values(material.metadata).join(", ")}
              >
                {Object.values(material.metadata).join(", ")}
              </span>
            </div>

            <button
              onClick={() => onRemove(index)}
              className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <AddMoreDataBtn icon={<Upload />} label={"Upload Subject Materials"} onClick={ onUpload } btnClassName="upload-materials-border-box" iconClassName="upload-materials-heading" labelClassName="upload-materials-heading" />  
    </div>
  );
}
