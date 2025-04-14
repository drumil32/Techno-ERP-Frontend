import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z, ZodObject } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPascal(title: string) {
  if (!title.includes('_')) {
    return title[0].toUpperCase() + title.slice(1).toLowerCase();
  }
  var words = title.split('_');
  var convertedTitle = '';
  words.forEach((word) => {
    let formatedWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
    convertedTitle += formatedWord;
    convertedTitle += ' ';
  });

  return convertedTitle;
}

export function filterBySchema<T extends ZodObject<any>>(
  schema: T,
  data: any
): Partial<z.infer<T>> {
  const shapeKeys = Object.keys(schema.shape);
  const filtered: any = {};

  for (const key of shapeKeys) {
    if (key in data) {
      filtered[key] = data[key];
    }
  }

  return filtered;
}
export function removeNullValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map(removeNullValues)
      .filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          item !== '' &&
          !(Array.isArray(item) && item.length === 0) &&
          !(isObject(item) && isAllValuesUndefined(item))
      );
  } else if (isObject(obj)) {
    const cleaned = Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, removeNullValues(v)])
        .filter(
          ([_, v]) =>
            v !== null &&
            v !== undefined &&
            v !== '' &&
            !(Array.isArray(v) && v.length === 0) &&
            !(isObject(v) && isAllValuesUndefined(v))
        )
    );

    return Object.keys(cleaned).length === 0 ? null : cleaned;
  }

  return obj;
}

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAllValuesUndefined(obj: object): boolean {
  return Object.values(obj).every((val) => val === undefined);
}


export const handleNumericInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: number | '') => void
) => {
  const rawValue = e.target.value;

  if (rawValue === '') {
    onChange('');
    return;
  }

  if (/^\d+$/.test(rawValue)) {
    onChange(Number(rawValue));
  }
};
