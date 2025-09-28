export default function OnboardingSN() {
  return (
    <main style={{ padding: 24, lineHeight: 1.5 }}>
      <h1>Bienvenido a Stacker News</h1>
      <p>
        Aquí te explico las opciones para crear tu cuenta y empezar a publicar, comentar y apoyar con sats.
      </p>
      <ol>
        <li>
          <strong>Registro por email</strong>: rápido y sencillo. Abre tu correo para confirmar.
        </li>
        <li>
          <strong>LNURL-auth</strong>: si usas Lightning, puedes autenticarte con tu wallet compatible.
        </li>
      </ol>
      <p>
        Cuando estés listo, entra aquí:
        {' '}
        <a href="https://stacker.news/villawolf" target="_blank" rel="noreferrer">Abrir Stacker News (referido)</a>
      </p>
      <p style={{opacity: 0.7}}>Tip: guarda tu usuario y añade tu wallet para poder recibir sats.</p>
    </main>
  );
}