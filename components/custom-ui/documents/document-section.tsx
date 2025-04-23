import React from "react";
import { Upload, X } from "lucide-react";
import { AddMoreDataBtn } from "../add-more-data-btn/add-data-btn";
import { CourseMaterialType } from "@/types/enum";

interface SubjectMaterial {
  courseId: string,
  semesterId: string,
  subjectId: string,
  planId?: string,
  type: CourseMaterialType,
  link: string,
  name: string,
  metaData: {
      topic: string
  }
}


type Props = { 
  materials: SubjectMaterial[];
  nameFontSize?: string;
  metadataFontSize?: string;
  onRemove : (index:number, materials :SubjectMaterial[]) => void
  onUpload : () => void
};

// const onRemove = (index : number, materials: SubjectMaterial[]) => {
//   console.log(index);
// }

export default function SubjectMaterialsSection({
  materials,
  nameFontSize = "text-sm",
  metadataFontSize = "text-xs",
  onRemove,
  onUpload
} : Props) {

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
                title={material.metaData.topic}
              >
                {/* {Object.values(material.metaData.topic).join(", ")} */}
                {material.metaData.topic}
              </span>
            </div>

            <button
              onClick={() => onRemove(index, materials)}
              className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
            >
              <X size={16} onClick={()=>onRemove(index, materials)}/>
            </button>
          </div>
        ))}
      </div>
      <AddMoreDataBtn icon={<Upload />} label={"Upload Subject Materials"} onClick={ onUpload } btnClassName="upload-materials-border-box" iconClassName="upload-materials-heading" labelClassName="upload-materials-heading" />  
    </div>
  );
}
