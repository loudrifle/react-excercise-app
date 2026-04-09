/**
 * NoteForm
 *
 * Semantic wrapper around the generic Form component.
 * Responsibilities are separated:
 * - Form: validation, field rendering, error display
 * - NoteForm: defines which fields exist and how they map to the Note domain
 *
 * This pattern (generic UI component + domain wrapper) avoids mixing business
 * logic with presentation logic inside the generic component.
 */
import { Form, Constraints } from '../../components/form';

interface NoteFormProps {
  onSubmit: (title: string, content: string) => void;
  onCancel: () => void;
}

export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  return (
    <div>
      <Form
        fields={{
          title: {
            label: 'Title',
            required: true,
            constraints: [{ code: Constraints.TOO_SHORT, args: [3] }],
          },
          content: {
            label: 'Content',
            required: true,
            constraints: [{ code: Constraints.TOO_SHORT, args: [10] }],
          },
        }}
        onSubmit={(data) => onSubmit(data.title, data.content)}
      />
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
