// tipo: "ok" | "erro" | "neutro" | "ativo"
export default function Chip({ tipo = "neutro", children }) {
  return <span className={`chip chip-${tipo}`}>{children}</span>;
}
