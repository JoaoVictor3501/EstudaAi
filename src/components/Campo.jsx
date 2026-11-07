// Campo de formulário com rótulo e mensagem de erro (heurística: prevenção e ajuda com erros).
export default function Campo({ id, rotulo, erro, ...props }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        aria-invalid={erro ? "true" : "false"}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...props}
      />
      {erro && (
        <p id={`${id}-erro`} className="campo-erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
