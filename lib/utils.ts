import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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