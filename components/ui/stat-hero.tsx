export function StatHero({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-3xl bg-surface p-8 text-center shadow-soft">
      <p className="text-5xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-caption">{label}</p>
    </div>
  );
}
