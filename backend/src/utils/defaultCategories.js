// Categorías iniciales que recibe todo usuario nuevo (o cualquier usuario
// antiguo que aún no tenga categorías propias -> ver categoryController.js).
// El campo `icon` es el nombre de un ícono de lucide-react; el mapeo a
// componente vive en el frontend (src/iconMap.js).
module.exports = [
  // --- Ingresos ---
  { name: "Salario", type: "income", color: "#10b981", icon: "Briefcase" },
  { name: "Freelance", type: "income", color: "#0ea5e9", icon: "Laptop" },
  { name: "Inversiones", type: "income", color: "#f59e0b", icon: "TrendingUp" },
  { name: "Otros Ingresos", type: "income", color: "#14b8a6", icon: "Coins" },

  // --- Gastos ---
  { name: "Comida", type: "expense", color: "#f97316", icon: "Utensils" },
  { name: "Transporte", type: "expense", color: "#3b82f6", icon: "Car" },
  { name: "Educación", type: "expense", color: "#8b5cf6", icon: "BookOpen" },
  { name: "Salud", type: "expense", color: "#f43f5e", icon: "HeartPulse" },
  { name: "Hogar", type: "expense", color: "#525252", icon: "Home" },
  { name: "Entretenimiento", type: "expense", color: "#ec4899", icon: "Tv" },
  { name: "Otros Gastos", type: "expense", color: "#a3a3a3", icon: "HelpCircle" },
];
