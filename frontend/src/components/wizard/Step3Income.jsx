import Input from "../ui/Input.jsx";

export default function Step3Income({ data, onChange }) {
  const set = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Income & category</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Used to check eligibility for income-based schemes. Never shared publicly.
      </p>

      <Input
        label="Annual family income (₹) *"
        name="annualFamilyIncome"
        type="number"
        min={0}
        placeholder="e.g. 150000"
        value={data.annualFamilyIncome ?? ""}
        onChange={(e) => set("annualFamilyIncome", e.target.value === "" ? null : Number(e.target.value))}
        hint="Approximate is fine. You can confirm later with your certificate."
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Community / Category <span className="text-slate-400">(only if relevant to a scheme)</span>
        </label>
        <select
          className="input-base"
          value={data.community || ""}
          onChange={(e) => set("community", e.target.value || null)}
        >
          <option value="">Prefer not to say</option>
          <option value="general">General</option>
          <option value="bc">BC</option>
          <option value="mbc">MBC</option>
          <option value="sc">SC</option>
          <option value="st">ST</option>
          <option value="other">Other</option>
        </select>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Some schemes are reserved for specific communities. We ask only where the official rules require it.
        </p>
      </div>
    </div>
  );
}