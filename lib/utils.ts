import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function mapRange(
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
  val: number,
) {
  return out_min + ((val - in_min) / (in_max - in_min)) * (out_max - out_min);
}
