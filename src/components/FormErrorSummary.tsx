import { AlertCircle } from 'lucide-react';

type FormErrorSummaryProps = {
  title?: string;
  errors: string[];
  id?: string;
};

const FormErrorSummary = ({ title = 'Please fix the following issues:', errors, id = 'form-error-summary' }: FormErrorSummaryProps) => {
  if (errors.length === 0) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      className="rounded-md border border-destructive/40 bg-destructive/10 p-3"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        {title}
      </p>
      <ul className="mt-2 list-disc pl-5 text-sm text-destructive space-y-1">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormErrorSummary;
