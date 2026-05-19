type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="space-y-1">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm opacity-70">{subtitle}</p>
    </header>
  );
}
