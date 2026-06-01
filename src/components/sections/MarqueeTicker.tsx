export function MarqueeTicker() {
  const items = ["KRAKATAU", "PANCING", "CEMARA ASRI", "HELVETIA", "TEMBUNG", "MEDAN BARU", "PERCUT", "KUALA NAMU"];
  const row = (
    <div className="marquee-track">
      {items.concat(items).map((t, i) => (
        <span key={i} className="text-text-primary text-xs font-bold tracking-widest-2">
          {t} <span className="ml-10 opacity-50">·</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="bg-gold py-2.5 marquee">
      {row}
      {row}
    </div>
  );
}
