import {
  Utensils,
  Car,
  BookOpen,
  HeartPulse,
  Home,
  Tv,
  Coins,
  Briefcase,
  Laptop,
  HelpCircle,
  ShoppingBag,
  Plane,
  Gift,
  Dumbbell,
  PawPrint,
  Baby,
  Wrench,
  Fuel,
  Smartphone,
  Wifi,
  GraduationCap,
  Banknote,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Shirt,
  Coffee,
  Music,
  Gamepad2,
  Tag,
} from "lucide-react";

// Nombre guardado en Category.icon (backend) -> componente de lucide-react.
// Mantener las claves como strings estables: cambiarlas rompería el ícono
// de categorías ya creadas en la base de datos.
export const ICON_MAP = {
  Utensils,
  Car,
  BookOpen,
  HeartPulse,
  Home,
  Tv,
  Coins,
  Briefcase,
  Laptop,
  HelpCircle,
  ShoppingBag,
  Plane,
  Gift,
  Dumbbell,
  PawPrint,
  Baby,
  Wrench,
  Fuel,
  Smartphone,
  Wifi,
  GraduationCap,
  Banknote,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Shirt,
  Coffee,
  Music,
  Gamepad2,
  Tag,
};

// Set curado que se ofrece al elegir/crear una categoría (subconjunto de
// ICON_MAP con nombres amigables en español para mostrar en el picker).
export const ICON_OPTIONS = [
  { name: "Utensils", label: "Comida" },
  { name: "Car", label: "Auto" },
  { name: "Fuel", label: "Combustible" },
  { name: "Home", label: "Hogar" },
  { name: "Wrench", label: "Mantenimiento" },
  { name: "BookOpen", label: "Libros" },
  { name: "GraduationCap", label: "Educación" },
  { name: "HeartPulse", label: "Salud" },
  { name: "Dumbbell", label: "Ejercicio" },
  { name: "Tv", label: "Streaming" },
  { name: "Gamepad2", label: "Juegos" },
  { name: "Music", label: "Música" },
  { name: "Coffee", label: "Café" },
  { name: "ShoppingBag", label: "Compras" },
  { name: "Shirt", label: "Ropa" },
  { name: "Plane", label: "Viajes" },
  { name: "Gift", label: "Regalos" },
  { name: "PawPrint", label: "Mascotas" },
  { name: "Baby", label: "Niños" },
  { name: "Smartphone", label: "Tecnología" },
  { name: "Wifi", label: "Internet" },
  { name: "CreditCard", label: "Tarjeta" },
  { name: "Briefcase", label: "Trabajo" },
  { name: "Laptop", label: "Freelance" },
  { name: "TrendingUp", label: "Inversiones" },
  { name: "Banknote", label: "Salario" },
  { name: "Coins", label: "Dinero" },
  { name: "PiggyBank", label: "Ahorro" },
  { name: "Tag", label: "Otro" },
];

// Paleta curada para el color picker (hex de Tailwind ~500).
export const COLOR_OPTIONS = [
  "#f43f5e", // rose
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#10b981", // emerald
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#525252", // neutral
  "#a3a3a3", // neutral light
];

export function getCategoryIcon(iconName) {
  return ICON_MAP[iconName] || Tag;
}
