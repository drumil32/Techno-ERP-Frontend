"use client"
import { createContext, useContext } from 'react';

export const HoverContext = createContext(false);

export const useHoverContext = () => useContext(HoverContext);

