import { FiUploadCloud, FiInfo } from "react-icons/fi";

export default function Step4Documents() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Upload documents (optional)</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        You can skip this for now. Uploading helps us improve accuracy but is not required to continue.
      </p>

      <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-10 text-center bg-slate-50 dark:bg-slate-900/40">
        <FiUploadCloud className="mx-auto text-4xl text-primary-600 dark:text-primary-400" />
        <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">Document AI coming soon</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          In a later phase, you'll be able to upload your income certificate, mark sheets,
          or community certificate. We'll extract key fields for you to review and confirm.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 p-4 text-sm text-blue-800 dark:text-blue-200">
        <FiInfo className="mt-0.5 shrink-0" />
        <p>
          <strong>Privacy note:</strong> We never store Aadhaar or identity numbers. Documents you
          upload stay private and can be deleted anytime.
        </p>
      </div>
    </div>
  );
}