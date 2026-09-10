/**
 * Service names + the grouped "what do you need" taxonomy shared by the lead
 * forms. Pillars without sub-services are a single option; pillars with
 * sub-services expose each sub-service (plus an "(all)" whole-pillar option), so
 * a lead can pick the specific thing or the pillar. See the Contact/Audit forms.
 */
import type { Field } from '@/lib/formFields';

/** The six pillars, for the pre-selected service dropdown on service pages. */
export const SERVICE_NAMES = [
  'Performance marketing',
  'SEO',
  'Shopify development',
  'Web & app development',
  'Social media marketing',
  'Conversion rate optimisation',
] as const;

/** Grouped category dropdown for the Contact form and free-audit flow. */
export const CATEGORY_FIELD: Field = {
  name: 'category',
  label: 'What do you need?',
  type: 'select',
  required: true,
  optgroups: [
    { label: 'Performance marketing', options: ['Performance marketing (all)', 'Meta Ads', 'Google Ads', 'Ecommerce PPC'] },
    { label: 'SEO', options: ['SEO (all)', 'Ecommerce SEO', 'Technical SEO audit', 'Local SEO', 'Answer engine optimisation'] },
    { label: 'Shopify development', options: ['Shopify development (all)', 'Store migration', 'Speed optimisation', 'Store redesign'] },
    { label: 'Websites & maintenance', options: ['Web & app development', 'Website revamp', 'Website migration', 'AMC (maintenance)'] },
    { label: 'Other', options: ['Social media marketing', 'Conversion rate optimisation', 'Not sure yet'] },
  ],
};
