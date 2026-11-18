/** The Halo mark, as on the home page: an orange ring floating over HALO in mono capitals. Text, so it stays sharp. */
export function Logo({className = '', title = 'Halo Automations'}: {className?: string; title?: string}) {
  return (
    <span className={`halo-mark ${className}`} {...(title ? {role: 'img', 'aria-label': title} : {'aria-hidden': true})}>
      <i aria-hidden="true" />
      <b aria-hidden="true">HALO</b>
    </span>
  );
}
