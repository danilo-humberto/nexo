import { getFieldMetadataItemGqlFieldName } from '@/object-metadata/utils/getFieldMetadataItemGqlFieldName';
import { type RecordFormField } from '@/object-record/record-form/types/RecordFormField';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type WidgetVisibilityContext } from '@/page-layout/types/WidgetVisibilityContext';
import { evaluateConditionalAvailabilityNode } from 'twenty-shared/conditional-availability';
import { buildRecordWithAllMorphObjectIdsToNull } from '@/object-record/record-field/ui/meta-types/input/utils/buildRecordWithAllMorphObjectIdsToNull';

export const getApplicableRecordFormFields = (
  recordFormFields: RecordFormField[],
  draftRecord: Partial<ObjectRecord>,
  visibilityContext: Pick<WidgetVisibilityContext, 'device' | 'featureFlags'>,
  policyDefaults?: Partial<ObjectRecord>,
) => {
  const context = { ...visibilityContext, selectedRecords: [draftRecord] };
  const applicableDraft = { ...draftRecord };
  const applicableFields = recordFormFields.filter(
    ({ widgets, fieldMetadataItem }) => {
      const matches = widgets.every(({ conditionalAvailability }) =>
        evaluateConditionalAvailabilityNode({
          node: conditionalAvailability,
          context,
        }),
      );

      if (!matches) {
        delete applicableDraft[
          getFieldMetadataItemGqlFieldName(fieldMetadataItem)
        ];
        const morphRelations = fieldMetadataItem.morphRelations;
        if (morphRelations?.[0]) {
          const joinColumns = buildRecordWithAllMorphObjectIdsToNull({
            fieldName: fieldMetadataItem.name,
            relationType: morphRelations[0].type,
            morphRelations,
          });
          for (const key of Object.keys(joinColumns)) {
            delete applicableDraft[key];
          }
        }
      }

      return matches;
    },
  );

  return {
    applicableDraft: { ...policyDefaults, ...applicableDraft },
    applicableFields,
  };
};
