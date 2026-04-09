/**
 * Form (generic component)
 *
 * Library: react-hook-form
 * Why: manages form state, validation and re-renders efficiently.
 * Inputs are uncontrolled (ref-based) by default — no re-render on every
 * keystroke, unlike controlled forms driven by useState.
 * Validation is triggered on blur (mode: 'onBlur') to avoid disrupting
 * the user while they are still typing.
 *
 * This component is intentionally domain-agnostic: it does not know about
 * notes, users, or any other entity. It receives field configuration as props
 * and delegates semantics to the caller via onSubmit. This makes it reusable
 * across any form in the application.
 */
import { useForm } from 'react-hook-form';
import type { Input, InputConstraint, InputParameters } from './form.constraints';
import { Constraints, constraintsMessages } from './form.constraints';

export { Constraints } from './form.constraints';
export type { Input, InputParameters, InputConstraint } from './form.constraints';

function runConstraint<K extends Constraints>(
  constraint: InputConstraint<K>,
  value: string
): string | null {
  const fn = constraintsMessages[constraint.code];
  return fn(value, ...(constraint.args ?? []));
}

function validateField(input: InputParameters, value: string): string[] {
  const errors: string[] = [];

  if (input.required && !value?.trim()) {
    errors.push('This field is required');
  }

  if (input.constraints) {
    for (const constraint of input.constraints) {
      const message = runConstraint(constraint, value);
      if (message) errors.push(message);
    }
  }

  return errors;
}

interface FormProps {
  fields: Input;
  /**
   * Called with validated data only if all fields pass validation.
   * The form resets automatically after the call.
   */
  onSubmit?: (data: Record<string, string>) => void;
}

export const Form = ({ fields, onSubmit }: FormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({ mode: 'onBlur' });

  const handleFormSubmit = (data: Record<string, string>) => {
    onSubmit?.(data);
    // Reset after submit: clears values and error state.
    // react-hook-form handles this internally without causing multiple re-renders.
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'inline-block' }}>
      {Object.entries(fields).map(([name, params]) => (
        <div key={name} style={{ display: 'block' }}>
          <label htmlFor={name}>{params.label}</label>
          <input
            type="text"
            id={name}
            {...register(name, {
              validate: (value) => {
                const fieldErrors = validateField(params, value);
                return fieldErrors.length > 0 ? fieldErrors.join(', ') : true;
              },
            })}
          />
          {errors[name] && (
            <p style={{ color: 'red' }}>{errors[name]?.message}</p>
          )}
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};
