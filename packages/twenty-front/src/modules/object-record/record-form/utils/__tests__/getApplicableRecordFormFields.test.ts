import { type RecordFormField } from '@/object-record/record-form/types/RecordFormField';
import { getApplicableRecordFormFields } from '@/object-record/record-form/utils/getApplicableRecordFormFields';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';
import { buildDeviceConditionalAvailability } from 'twenty-shared/conditional-availability';

const pet = getMockObjectMetadataItemOrThrow('pet');
const formField = (name: string, sector?: string): RecordFormField => {
  const field = pet.fields.find((candidate) => candidate.name === name);
  if (!field) {
    throw new Error(name);
  }
  return {
    fieldMetadataItem: field,
    isVisible: true,
    widgets: [
      {
        id: field.id,
        isActive: true,
        position: null,
        conditionalAvailability: sector
          ? {
              type: 'FUNCTION_CALL',
              functionName: 'someEquals',
              arguments: [
                { type: 'VARIABLE', path: 'selectedRecords' },
                { type: 'LITERAL', value: 'sector' },
                { type: 'LITERAL', value: sector },
              ],
            }
          : null,
      },
    ],
  };
};

describe('getApplicableRecordFormFields', () => {
  const shared = formField('name');
  const restricted = formField('polymorphicOwner', 'TI');
  const fields = [shared, restricted];
  const draft = {
    name: 'Rex',
    position: 'first',
    polymorphicOwnerRocketId: 'from-view',
  };
  const context = { device: 'DESKTOP', featureFlags: {} } as const;

  it('resolves an existing device rule against the layout context', () => {
    const byDevice = formField('name');
    byDevice.widgets[0].conditionalAvailability =
      buildDeviceConditionalAvailability('DESKTOP');
    expect(
      getApplicableRecordFormFields([byDevice], draft, context)
        .applicableFields,
    ).toEqual([byDevice]);
    expect(
      getApplicableRecordFormFields([byDevice], draft, {
        ...context,
        device: 'MOBILE',
      }).applicableFields,
    ).toEqual([]);
  });

  it('keeps common fields and removes inactive answers and seeded join columns', () => {
    const input = {
      ...draft,
      sector: 'COMPRAS',
      polymorphicOwner: { id: 'rocket' },
    };
    expect(getApplicableRecordFormFields(fields, input, context)).toEqual({
      applicableFields: [shared],
      applicableDraft: { name: 'Rex', position: 'first', sector: 'COMPRAS' },
    });
    expect(input.polymorphicOwnerRocketId).toBe('from-view');
  });

  it('matches a preselected sector and hides restricted fields before selection', () => {
    const policyDefaults = { polymorphicOwnerRocketId: 'required-owner' };
    expect(
      getApplicableRecordFormFields(fields, draft, context, policyDefaults)
        .applicableDraft,
    ).toEqual({ name: 'Rex', position: 'first', ...policyDefaults });
    expect(
      getApplicableRecordFormFields(fields, draft, context).applicableFields,
    ).toEqual([shared]);
    expect(
      getApplicableRecordFormFields(
        fields,
        { ...draft, sector: 'TI' },
        context,
      ),
    ).toEqual({
      applicableFields: fields,
      applicableDraft: { ...draft, sector: 'TI' },
    });
  });
});
