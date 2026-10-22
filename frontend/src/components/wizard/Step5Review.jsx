import { FiCheckCircle, FiEdit2 } from "react-icons/fi";

function Row({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right">
          {value || "—"}
        </span>
        {onEdit && (
          <button onClick={onEdit} className="text-primary-600 dark:text-primary-400 hover:underline text-xs">
            <FiEdit2 className="inline" /> Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default function Step5Review({ data, onJumpToStep }) {
  const cat = data.category;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Review & confirm</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Please check your details. You can edit any step before confirming.
      </p>

      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Basic</h3>
        <Row label="Full name" value={data.fullName} onEdit={() => onJumpToStep(1)} />
        <Row label="Date of birth" value={data.dateOfBirth?.split("T")[0]} onEdit={() => onJumpToStep(1)} />
        <Row label="Gender" value={data.gender} onEdit={() => onJumpToStep(1)} />
        <Row label="District" value={data.district} onEdit={() => onJumpToStep(1)} />
      </div>

      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 capitalize">{cat} details</h3>
        {cat === "student" && (
          <>
            <Row label="Education level" value={data.student?.educationLevel} onEdit={() => onJumpToStep(2)} />
            <Row label="Institution" value={data.student?.institution} onEdit={() => onJumpToStep(2)} />
            <Row label="Course" value={data.student?.course} onEdit={() => onJumpToStep(2)} />
            <Row label="10th %" value={data.student?.tenthPercentage} onEdit={() => onJumpToStep(2)} />
            <Row label="12th %" value={data.student?.twelfthPercentage} onEdit={() => onJumpToStep(2)} />
          </>
        )}
        {cat === "farmer" && (
          <>
            <Row label="Farmer type" value={data.farmer?.farmerType} onEdit={() => onJumpToStep(2)} />
            <Row label="Land size" value={data.farmer?.landSizeAcres && `${data.farmer.landSizeAcres} acres`} onEdit={() => onJumpToStep(2)} />
            <Row label="Crops" value={(data.farmer?.crops || []).join(", ")} onEdit={() => onJumpToStep(2)} />
          </>
        )}
        {cat === "woman" && (
          <>
            <Row label="Marital status" value={data.woman?.maritalStatus} onEdit={() => onJumpToStep(2)} />
            <Row label="Employment" value={data.woman?.employmentStatus} onEdit={() => onJumpToStep(2)} />
          </>
        )}
        {cat === "jobseeker" && (
          <>
            <Row label="Employment status" value={data.jobSeeker?.employmentStatus} onEdit={() => onJumpToStep(2)} />
            <Row label="Education" value={data.jobSeeker?.highestEducation} onEdit={() => onJumpToStep(2)} />
            <Row label="Skills" value={(data.jobSeeker?.skills || []).join(", ")} onEdit={() => onJumpToStep(2)} />
          </>
        )}
        {cat === "entrepreneur" && (
          <>
            <Row label="Business type" value={data.entrepreneur?.businessType} onEdit={() => onJumpToStep(2)} />
            <Row label="Stage" value={data.entrepreneur?.businessStage} onEdit={() => onJumpToStep(2)} />
            <Row label="Funding need" value={data.entrepreneur?.fundingNeed} onEdit={() => onJumpToStep(2)} />
          </>
        )}
        {cat === "senior" && (
          <Row label="Pension status" value={data.senior?.pensionStatus} onEdit={() => onJumpToStep(2)} />
        )}
        {cat === "disability" && (
          <>
            <Row label="Disability type" value={data.disability?.disabilityType} onEdit={() => onJumpToStep(2)} />
            <Row label="Percentage" value={data.disability?.disabilityPercentage} onEdit={() => onJumpToStep(2)} />
          </>
        )}
        {cat === "general" && <p className="text-sm text-slate-500">No extra details.</p>}
      </div>

      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Income</h3>
        <Row label="Annual family income" value={data.annualFamilyIncome && `₹${data.annualFamilyIncome.toLocaleString("en-IN")}`} onEdit={() => onJumpToStep(3)} />
        <Row label="Community" value={data.community} onEdit={() => onJumpToStep(3)} />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 p-4 text-sm text-emerald-800 dark:text-emerald-200">
        <FiCheckCircle className="mt-0.5 shrink-0" />
        <p>
          By confirming, you agree this data is accurate to the best of your knowledge. You can
          edit it later from your dashboard.
        </p>
      </div>
    </div>
  );
}