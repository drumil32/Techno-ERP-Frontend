import React from 'react';

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
    containerWidth = '100%',
    containerHeight = 'auto',
    containerPadding = '1.5rem',
    columnWidth = '100%',
    columnHeight = 'auto',
    columnGap = '2rem',
    rowGap = '0.75rem',
    keyWidth = '40%',
    valueWidth = '60%',
    fontSize = '0.875rem'
  } = design;

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 w-full max-w-6xl mx-auto my-4
                 border border-gray-100 overflow-hidden transition-all duration-300
                 hover:shadow-md"
      style={{
        padding: containerPadding,
        width: containerWidth,
        height: containerHeight
      }}
    >
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {columnData.map((column, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 w-full md:w-auto"
            style={{
              width: columnWidth,
              height: columnHeight,
              gap: rowGap
            }}
          >
            {column.map(([key, value]) => (
              <div key={key} className="flex items-start">
                <div
                  className="text-gray-500 font-medium pr-2 truncate"
                  style={{
                    width: keyWidth,
                    fontSize: fontSize
                  }}
                >
                  {key}
                </div>
                <div
                  className="text-gray-800 font-semibold truncate"
                  style={{
                    width: valueWidth,
                    fontSize: fontSize
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicInfoGrid;
