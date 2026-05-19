type MoneyInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function MoneyInput({ id, value, onChange }: MoneyInputProps) {
  return (
    <div className="join w-full">
      <span className="join-item btn btn-disabled bg-base-200 border-base-300 px-3">
        $
      </span>
      <input
        id={id}
        type="number"
        min="0"
        step="0.01"
        className="input input-bordered join-item w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
