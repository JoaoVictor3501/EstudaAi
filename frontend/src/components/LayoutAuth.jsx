import logo from "../assets/logo.png";

// Molde das telas de entrar e criar conta (usado em Login.jsx e Cadastro.jsx).
// À esquerda fica um cartão lavanda com uma frase motivacional; à direita, o logo,
// o título e o formulário. Cada tela passa a própria frase e o próprio formulário.
//
// Props:
//   frase, autor      -> texto da citação e quem disse
//   titulo, subtitulo -> textos acima do formulário
//   idTitulo          -> id do <h1>, usado para dar nome à seção (acessibilidade)
//   children          -> o formulário e os links da tela
export default function LayoutAuth({ frase, autor, titulo, subtitulo, idTitulo, children }) {
  return (
    <main className="auth-dividido">
      {/* Cartão da frase. <figure> + <blockquote> + <figcaption> é o jeito
          semântico de mostrar uma citação com o nome do autor. */}
      <figure className="auth-frase">
        <blockquote>
          <p>{frase}</p>
        </blockquote>
        <figcaption>{autor}</figcaption>
      </figure>

      {/* Lado do formulário */}
      <section className="auth-lado-form" aria-labelledby={idTitulo}>
        <div className="auth-topo">
          <img src={logo} alt="EstudaAí" className="logo-grande" />
          <h1 id={idTitulo}>{titulo}</h1>
          <p className="texto-sec">{subtitulo}</p>
        </div>

        {children}
      </section>
    </main>
  );
}
