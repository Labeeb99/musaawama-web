type CardProps = {
  title: string;
  value: number;
};

export function Card({ title, value }: CardProps) {
  return (
    <div className="rounded-2xl border p-6 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
