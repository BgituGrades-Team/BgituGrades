import { createContext } from "react";
import type { ReverseSearchInterface } from "../types/interfaces";


/**
 * Контекст для работы с темой
 */
export const ThemeContext = createContext("dark")

/**
 * Контекст для работы с аутентификацией(TODO)
 */
export const AuthContext = createContext(true);

/**
 * 
 */
export const ReverseSearchContext = createContext<null | ReverseSearchInterface>(null)
