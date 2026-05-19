export default function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('concert-theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
