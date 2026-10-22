import { useEffect, useState } from "react";
import { FiBookmark } from "react-icons/fi";
import { savedApi } from "../../api/saved.api.js";
import { useToast } from "../../context/ToastContext.jsx";
import Button from "../ui/Button.jsx";

export default function SaveButton({
  schemeId,
  initialSaved = false,
  variant = "outline",
  size = "md",
  onChange,
  showLabel = true,
}) {
  const toast = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  // Sync if parent passes a new initialSaved value
  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    setBusy(true);
    const wasSaved = saved;
    setSaved(!wasSaved); // optimistic

    try {
      if (wasSaved) {
        await savedApi.unsave(schemeId);
        toast.info("Removed from saved");
      } else {
        await savedApi.save(schemeId);
        toast.success("Scheme saved!");
      }
      onChange?.(!wasSaved);
    } catch (err) {
      setSaved(wasSaved); // revert
      toast.error(err.message || "Failed to update");
    } finally {
      setBusy(false);
    }
  };

  const cls = saved
    ? "!bg-primary-600 !text-white !border-primary-600 hover:!bg-primary-700"
    : "";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggle}
      disabled={busy}
      className={cls}
      aria-label={saved ? "Remove from saved" : "Save scheme"}
      title={saved ? "Remove from saved" : "Save this scheme"}
    >
      <FiBookmark className={saved ? "fill-current" : ""} />
      {showLabel && (saved ? "Saved" : "Save")}
    </Button>
  );
}