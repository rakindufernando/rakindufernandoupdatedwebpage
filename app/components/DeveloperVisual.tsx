/** Decorative only. The site's real information remains semantic HTML. */
export default function DeveloperVisual() {
  return <div className="developer-visual" aria-hidden="true">
    <div className="developer-grid" />
    <span className="code-glyph glyph-one">&lt;/&gt;</span><span className="code-glyph glyph-two">{'{ }'}</span>
    <div className="developer-terminal" data-depth>
      <div className="terminal-bar"><span><i /><i /><i /></span><b>studio / build.ts</b></div>
      <pre><code><span className="code-line"><b>const</b> experience = {'{'}</span><span className="code-line">  design: <em>&quot;human-first&quot;</em>,</span><span className="code-line">  code: <em>&quot;purposeful&quot;</em>,</span><span className="code-line">  motion: <em>&quot;considered&quot;</em></span><span className="code-line">{'};'}</span><span className="terminal-prompt">&gt; create(experience)<i /></span></code></pre>
    </div>
    <div className="data-stream"><i /><i /><i /></div>
  </div>;
}
