import Input from "../ui/Input.jsx";
import { TN_DISTRICTS } from "../../utils/constants.js";

export default function Step1Basic({ data, onChange, errors = {} }) {
  const set = (key, value) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Basic information</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">Just the essentials — nothing sensitive.</p>

      <Input
        label="Full name"
        name="fullName"
        placeholder="e.g. Priya Rajesh"
        value={data.fullName || ""}
        onChange={(e) => set("fullName", e.target.value)}
        error={errors.fullName}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Date of birth"
          name="dateOfBirth"
          type="date"
          value={data.dateOfBirth || ""}
          onChange={(e) => set("dateOfBirth", e.target.value)}
          hint="Used only for age-related schemes"
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Gender <span className="text-slate-400">(only where required by scheme)</span>
          </label>
          <select
            className="input-base"
            value={data.gender || ""}
            onChange={(e) => set("gender", e.target.value || null)}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">State</label>
          <select
            className="input-base"
            value={data.state || "Tamil Nadu"}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">District *</label>
          <select
            className="input-base"
            value={data.district || ""}
            onChange={(e) => set("district", e.target.value)}
          >
            <option value="">Select your district</option>
            {TN_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
        </div>
      </div>
    </div>
  );
}