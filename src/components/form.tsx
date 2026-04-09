import { useForm } from "react-hook-form";
import type { Input, InputConstraint, InputParameters } from "./form.constraints";
import { Constraints, constraintsMessages } from "./form.constraints";

export { Constraints } from "./form.constraints";
export type { Input, InputParameters, InputConstraint } from "./form.constraints";

function runConstraint<K extends Constraints>(
  constraint: InputConstraint<K>,
  value: string
): string | null {
  const fn = constraintsMessages[constraint.code];
  return fn(value, ...(constraint.args ?? []));
}

const validateField = (
  input: InputParameters,
  value: string
): string[] => {
  const errors: string[] = [];

  if (input.required && !value?.trim()) {
    errors.push("This field is required");
  }

  if (input.constraints) {
    for (const constraint of input.constraints) {
      const message = runConstraint(constraint, value);
      if (message) errors.push(message);
    }
  }

  return errors;
};

export const Form = ({ fields }: { fields: Input }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ [key: string]: string }>({ mode: "onBlur" });

  const onSubmit = (data: Record<string, string>) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "inline-block" }}>
      {Object.entries(fields).map(([name, params]) => (
        <div key={name} style={{ display: "block" }}>
          <label htmlFor={name}>{params.label}</label>
          <input
            type="text"
            id={name}
            {...register(name, {
              validate: (value) => {
                const fieldErrors = validateField(params, value);
                if (fieldErrors.length > 0) {
                  return fieldErrors.join(", ");
                }
                return true;
              },
            })}
          />
          {errors[name] && (
            <p style={{ color: "red" }}>{errors[name]?.message}</p>
          )}
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};
