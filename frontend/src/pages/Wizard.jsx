import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiSave, FiCheck } from "react-icons/fi";
import Button from "../components/ui/Button.jsx";
import ProgressBar from "../components/wizard/ProgressBar.jsx";
import Step1Basic from "../components/wizard/Step1Basic.jsx";
import Step2Category from "../components/wizard/Step2Category.jsx";
import Step3Income from "../components/wizard/Step3Income.jsx";
import Step4Documents from "../components/wizard/Step4Documents.jsx";
import Step5Review from "../components/wizard/Step5Review.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

export default function Wizard() {
  const navigate = useNavigate();
  const { profile, saveProfile, confirmProfile } = useProfile();

  const [step, setStep] = useState(1);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Initialize with stored category or existing profile
  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (profile) {
      setData({
        category: profile.category,
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
        gender: profile.gender,
        state: profile.state,
        district: profile.district,
        country: profile.country,
        annualFamilyIncome: profile.annualFamilyIncome,
        community: profile.community,
        student: profile.student || {},
        farmer: profile.farmer || {},
        woman: profile.woman || {},
        jobSeeker: profile.jobSeeker || {},
        entrepreneur: profile.entrepreneur || {},
        senior: profile.senior || {},
        disability: profile.disability || {},
      });
      setStep(Math.min(profile.currentStep || 1, 5));
    } else if (storedCategory) {
      setData({
        category: storedCategory,
        state: "Tamil Nadu",
        country: "India",
        student: {}, farmer: {}, woman: {}, jobSeeker: {},
        entrepreneur: {}, senior: {}, disability: {},
      });
    } else {
      navigate("/category");
    }
  }, [profile, navigate]);

  if (!data) return null;

  // -------- Validation per step --------
  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!data.fullName?.trim()) e.fullName = "Full name is required";
      if (!data.district) e.district = "District is required";
    }
    if (s === 3) {
      if (data.annualFamilyIncome === null || data.annualFamilyIncome === undefined)
        e.annualFamilyIncome = "Annual income is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;
    setSaving(true);
    try {
      // Save progress to backend
      await saveProfile({ ...data, currentStep: Math.min(step + 1, 5) });
      setStep((s) => Math.min(s + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step === 1) return navigate("/category");
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await saveProfile({ ...data, currentStep: step });
      setSavedMsg("Draft saved");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!validateStep(step)) return;
    setSaving(true);
    try {
      await saveProfile(data);
      await confirmProfile();
      localStorage.removeItem("selectedCategory");
      navigate("/dashboard");
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Basic data={data} onChange={setData} errors={errors} />;
      case 2: return <Step2Category category={data.category} data={data} onChange={setData} errors={errors} />;
      case 3: return <Step3Income data={data} onChange={setData} errors={errors} />;
      case 4: return <Step4Documents />;
      case 5: return <Step5Review data={data} onJumpToStep={(s) => setStep(s)} />;
      default: return null;
    }
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 transition-colors min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-hero-mesh opacity-30 dark:opacity-15" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="container-app py-10 max-w-3xl">
        <ProgressBar current={step} total={5} />

        <div className="mt-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-soft fade-in">
          {errors.server && (
            <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm px-4 py-3">
              {errors.server}
            </div>
          )}

          {renderStep()}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={handleBack} disabled={saving}>
              <FiArrowLeft /> {step === 1 ? "Change category" : "Back"}
            </Button>

            <div className="flex items-center gap-3">
              {savedMsg && <span className="text-xs text-emerald-600 dark:text-emerald-400">{savedMsg}</span>}

              <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                <FiSave /> {saving ? "Saving..." : "Save draft"}
              </Button>

              {step < 5 ? (
                <Button onClick={handleNext} disabled={saving} className="shadow-glow">
                  Next <FiArrowRight />
                </Button>
              ) : (
                <Button variant="success" onClick={handleConfirm} disabled={saving} className="shadow-glow">
                  <FiCheck /> Confirm Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}