import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <p className="text-6xl font-extrabold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="inline-block mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}