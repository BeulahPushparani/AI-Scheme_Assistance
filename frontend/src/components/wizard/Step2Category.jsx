import Input from "../ui/Input.jsx";

export default function Step2Category({ category, data, onChange, errors = {} }) {
  const set = (key, value) => onChange({ ...data, [key]: value });

  // Renders the right fields based on selected category
  const renderCategoryFields = () => {
    switch (category) {
      case "student":
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Education level</label>
                <select className="input-base" value={data.student?.educationLevel || ""} onChange={(e) => set("student", { ...data.student, educationLevel: e.target.value })}>
                  <option value="">Select</option>
                  <option value="school">Currently in school</option>
                  <option value="12th_pass">Completed 12th</option>
                  <option value="ug_ongoing">UG ongoing</option>
                  <option value="ug_done">UG completed</option>
                  <option value="pg_ongoing">PG ongoing</option>
                  <option value="pg_done">PG completed</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input label="Year of study" value={data.student?.yearOfStudy || ""} onChange={(e) => set("student", { ...data.student, yearOfStudy: e.target.value })} placeholder="e.g. 2nd year" />
            </div>
            <Input label="Institution name" value={data.student?.institution || ""} onChange={(e) => set("student", { ...data.student, institution: e.target.value })} placeholder="e.g. Madurai Kamaraj University" />
            <Input label="Course" value={data.student?.course || ""} onChange={(e) => set("student", { ...data.student, course: e.target.value })} placeholder="e.g. B.Sc Computer Science" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="10th percentage" type="number" min={0} max={100} value={data.student?.tenthPercentage ?? ""} onChange={(e) => set("student", { ...data.student, tenthPercentage: e.target.value === "" ? null : Number(e.target.value) })} />
              <Input label="12th percentage" type="number" min={0} max={100} value={data.student?.twelfthPercentage ?? ""} onChange={(e) => set("student", { ...data.student, twelfthPercentage: e.target.value === "" ? null : Number(e.target.value) })} />
            </div>
          </>
        );

      case "farmer":
        return (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Farmer type</label>
                <select className="input-base" value={data.farmer?.farmerType || ""} onChange={(e) => set("farmer", { ...data.farmer, farmerType: e.target.value })}>
                  <option value="">Select</option>
                  <option value="landowner">Landowner</option>
                  <option value="tenant">Tenant</option>
                  <option value="sharecropper">Sharecropper</option>
                  <option value="agricultural_labourer">Agricultural labourer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input label="Land size (acres)" type="number" min={0} value={data.farmer?.landSizeAcres ?? ""} onChange={(e) => set("farmer", { ...data.farmer, landSizeAcres: e.target.value === "" ? null : Number(e.target.value) })} />
            </div>
            <Input label="Main crops (comma separated)" value={(data.farmer?.crops || []).join(", ")} onChange={(e) => set("farmer", { ...data.farmer, crops: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="e.g. Paddy, Sugarcane" />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Irrigation type</label>
              <select className="input-base" value={data.farmer?.irrigationType || ""} onChange={(e) => set("farmer", { ...data.farmer, irrigationType: e.target.value })}>
                <option value="">Select</option>
                <option value="rainfed">Rain-fed</option>
                <option value="canal">Canal</option>
                <option value="borewell">Borewell</option>
                <option value="tank">Tank</option>
                <option value="mixed">Mixed</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );

      case "woman":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Marital status</label>
              <select className="input-base" value={data.woman?.maritalStatus || ""} onChange={(e) => set("woman", { ...data.woman, maritalStatus: e.target.value })}>
                <option value="">Select</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="divorced">Divorced</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Employment status</label>
              <select className="input-base" value={data.woman?.employmentStatus || ""} onChange={(e) => set("woman", { ...data.woman, employmentStatus: e.target.value })}>
                <option value="">Select</option>
                <option value="unemployed">Unemployed</option>
                <option value="employed">Employed</option>
                <option value="self_employed">Self-employed</option>
                <option value="student">Student</option>
                <option value="homemaker">Homemaker</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        );

      case "jobseeker":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Employment status</label>
              <select className="input-base" value={data.jobSeeker?.employmentStatus || ""} onChange={(e) => set("jobSeeker", { ...data.jobSeeker, employmentStatus: e.target.value })}>
                <option value="">Select</option>
                <option value="unemployed">Unemployed</option>
                <option value="part_time">Part-time</option>
                <option value="full_time">Full-time</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Highest education" value={data.jobSeeker?.highestEducation || ""} onChange={(e) => set("jobSeeker", { ...data.jobSeeker, highestEducation: e.target.value })} placeholder="e.g. B.Com" />
            <Input label="Skills (comma separated)" value={(data.jobSeeker?.skills || []).join(", ")} onChange={(e) => set("jobSeeker", { ...data.jobSeeker, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="e.g. Data entry, Tally" />
          </>
        );

      case "entrepreneur":
        return (
          <>
            <Input label="Business type" value={data.entrepreneur?.businessType || ""} onChange={(e) => set("entrepreneur", { ...data.entrepreneur, businessType: e.target.value })} placeholder="e.g. Bakery, IT services" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Business stage</label>
                <select className="input-base" value={data.entrepreneur?.businessStage || ""} onChange={(e) => set("entrepreneur", { ...data.entrepreneur, businessStage: e.target.value })}>
                  <option value="">Select</option>
                  <option value="idea">Idea</option>
                  <option value="pre_launch">Pre-launch</option>
                  <option value="early">Early</option>
                  <option value="growth">Growth</option>
                  <option value="established">Established</option>
                </select>
              </div>
              <Input label="Sector" value={data.entrepreneur?.sector || ""} onChange={(e) => set("entrepreneur", { ...data.entrepreneur, sector: e.target.value })} placeholder="e.g. Food processing" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Funding need</label>
              <select className="input-base" value={data.entrepreneur?.fundingNeed || ""} onChange={(e) => set("entrepreneur", { ...data.entrepreneur, fundingNeed: e.target.value })}>
                <option value="">Select</option>
                <option value="none">None</option>
                <option value="under_1L">Under ₹1 Lakh</option>
                <option value="1L_to_10L">₹1L – ₹10L</option>
                <option value="10L_to_50L">₹10L – ₹50L</option>
                <option value="above_50L">Above ₹50L</option>
              </select>
            </div>
          </>
        );

      case "senior":
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current pension status</label>
            <select className="input-base" value={data.senior?.pensionStatus || ""} onChange={(e) => set("senior", { ...data.senior, pensionStatus: e.target.value })}>
              <option value="">Select</option>
              <option value="none">Not receiving any</option>
              <option value="state">State pension</option>
              <option value="central">Central pension</option>
              <option value="both">Both</option>
            </select>
          </div>
        );

      case "disability":
        return (
          <>
            <Input label="Disability type" value={data.disability?.disabilityType || ""} onChange={(e) => set("disability", { ...data.disability, disabilityType: e.target.value })} placeholder="e.g. Visual, Locomotor" />
            <Input label="Disability percentage" type="number" min={0} max={100} value={data.disability?.disabilityPercentage ?? ""} onChange={(e) => set("disability", { ...data.disability, disabilityPercentage: e.target.value === "" ? null : Number(e.target.value) })} hint="As mentioned on your disability certificate" />
          </>
        );

      default:
        return (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No additional details needed for this category.
          </p>
        );
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Tell us about your {category === "jobseeker" ? "job search" : category}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        These details help us find schemes that fit your situation.
      </p>
      {renderCategoryFields()}
    </div>
  );
}