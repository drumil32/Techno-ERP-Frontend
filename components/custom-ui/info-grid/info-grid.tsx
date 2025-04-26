import React from "react";

interface InfoGridProps {
  columns: number;
  rowsPerColumn: number[];
  data: Record<string, string>;
  design?: {
    containerWidth?: string;
    containerHeight?: string;
    containerPadding?: string;
    columnWidth?: string;
    columnHeight?: string;
    columnGap?: string;
    rowGap?: string;
    keyWidth?: string;
    valueWidth?: string;
    fontSize?: string;
  };
}

const DynamicInfoGrid: React.FC<InfoGridProps> = ({
  columns,
  rowsPerColumn,
  data,
  design = {}
}) => {
  const entries = Object.entries(data);
  const columnData: [string, string][][] = [];
  let start = 0;

  for (let i = 0; i < columns; i++) {
    const count = rowsPerColumn[i];
    columnData.push(entries.slice(start, start + count));
    start += count;
  }

  const {
    containerWidth = "1339px",
    containerHeight = "119px",
    containerPadding = "10px 595px 10px 16px",
    columnWidth = "306px",
    columnHeight = "96px",
    columnGap = "85px",
    rowGap = "12px",
    keyWidth = "130px",
    valueWidth = "140px",
    fontSize = "14px"
  } = design;

  const keyW = parseInt(keyWidth);
  const valueW = parseInt(valueWidth);
  const totalW = parseInt(columnWidth);
  const gapBetween = `${totalW - keyW - valueW}px`;

  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        padding: containerPadding,
        display: "flex",
        gap: columnGap,
  
        borderRadius: "12px",
      }}
    >
      {columnData.map((column, i) => (
        <div
          key={i}
          style={{
            width: columnWidth,
            height: columnHeight,
            display: "flex",
            flexDirection: "column",
            gap: rowGap
          }}
        >
          {column.map(([key, value]) => (
            <div
              key={key}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className="font-light"
                style={{
                  width: keyWidth,
                  color: "#666666",
                }}
              >
                {key}
              </div>
              <div style={{ width: gapBetween }} /> 
              <div className="font-dark font-inter"
                style={{
                  width: valueWidth,
                 
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DynamicInfoGrid;
