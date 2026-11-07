// Ícones ilustrados do EstudaAí (arquivos em src/assets/icones).
// Por padrão são decorativos (alt vazio): o texto ao lado já diz o que é.
// Passe "rotulo" só quando o ícone estiver sozinho e precisar ser lido pelo leitor de tela.
const arquivos = import.meta.glob("../assets/icones/*.webp", { eager: true, import: "default" });

const icones = Object.fromEntries(
  Object.entries(arquivos).map(([caminho, url]) => [
    caminho.split("/").pop().replace(".webp", ""),
    url,
  ])
);

// nome: inicio, estudos, simulados, disciplinas, progresso, conquistas, calendario,
// notificacoes, perfil, configuracoes, busca, favoritos, sucesso, erro, foco, tempo,
// motivacao, ajuda
export default function Icone({ nome, tamanho = 24, rotulo = "", className = "" }) {
  const src = icones[nome];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={rotulo}
      aria-hidden={rotulo ? undefined : "true"}
      width={tamanho}
      height={tamanho}
      className={`icone ${className}`.trim()}
    />
  );
}
