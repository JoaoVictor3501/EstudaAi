import { useState } from "react";

// Campo de formulário com rótulo e mensagem de erro (heurística: prevenção e ajuda com erros).
// Quando type="password", aparece um botão de olho para mostrar ou esconder a senha.
export default function Campo({ id, rotulo, erro, type, ...props }) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const ehSenha = type === "password";

  const input = (
    <input
      id={id}
      type={ehSenha && senhaVisivel ? "text" : type}
      aria-invalid={erro ? "true" : "false"}
      aria-describedby={erro ? `${id}-erro` : undefined}
      {...props}
    />
  );

  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {ehSenha ? (
        <div className="campo-senha">
          {input}
          <button
            type="button"
            className="btn-olho"
            onClick={() => setSenhaVisivel((v) => !v)}
            aria-label={senhaVisivel ? "Esconder senha" : "Mostrar senha"}
            aria-pressed={senhaVisivel}
            aria-controls={id}
            title={senhaVisivel ? "Esconder senha" : "Mostrar senha"}
          >
            {senhaVisivel ? <OlhoFechado /> : <OlhoAberto />}
          </button>
        </div>
      ) : (
        input
      )}
      {erro && (
        <p id={`${id}-erro`} className="campo-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}

function OlhoAberto() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function OlhoFechado() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.9 3.9" />
      <path d="M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
