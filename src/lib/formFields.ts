/**
 * Shared form-field type for LeadForm and service content. Kept in a .ts module
 * so both .astro components and .ts data files can import it.
 */
export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  autocomplete?: string;
  options?: string[]; // for select
}
