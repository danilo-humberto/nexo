import { useLingui } from '@lingui/react/macro';
import { type ConditionalAvailabilityNode } from 'twenty-shared/conditional-availability';
import { isDefined } from 'twenty-shared/utils';
import { Select } from 'twenty-ui/primitives/input';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';

export const getRecordFormConditionSource = (
  rule?: ConditionalAvailabilityNode | null,
) => {
  if (rule?.type !== 'FUNCTION_CALL' || rule.functionName !== 'someEquals') {
    return;
  }
  const [records, field, value] = rule.arguments;
  if (
    records?.type === 'VARIABLE' &&
    records.path === 'selectedRecords' &&
    field?.type === 'LITERAL' &&
    typeof field.value === 'string' &&
    value?.type === 'LITERAL' &&
    typeof value.value === 'string'
  ) {
    return { name: field.value, value: value.value };
  }
};

type RecordFormConditionSelectProps = {
  label: string;
  sources: FieldMetadataItem[];
  rule?: ConditionalAvailabilityNode | null;
  disabled: boolean;
  onChange: (rule: ConditionalAvailabilityNode | null) => void;
};

export const RecordFormConditionSelect = ({
  label,
  sources,
  rule,
  disabled,
  onChange,
}: RecordFormConditionSelectProps) => {
  const { t } = useLingui();
  const condition = getRecordFormConditionSource(rule);
  const choices = sources.flatMap((field) =>
    (field.options ?? [])
      .filter((option) => option.isActive !== false)
      .map((option) => ({
        label: `${field.label} · ${option.label}`,
        optionLabel: option.label,
        value: option.id,
        fieldName: field.name,
        optionValue: option.value,
      })),
  );
  if (!choices.length && !rule) {
    return null;
  }
  const current = choices.find(
    (choice) =>
      choice.fieldName === condition?.name &&
      choice.optionValue === condition?.value,
  );
  const items = [{ value: '', label: t`All` }, ...choices];
  if (rule && !current) {
    items.push({ value: 'custom', label: t`Custom` });
  }
  const accessibleLabel = `${label} · ${t`Condition`}`;
  return (
    <Select.Root<string>
      items={items}
      disabled={disabled}
      value={current?.value ?? (rule ? 'custom' : '')}
      onValueChange={(value, details) => {
        if (
          details.reason !== 'item-press' ||
          !isDefined(value) ||
          value === 'custom'
        ) {
          return;
        }
        const choice = choices.find((item) => item.value === value);
        onChange(
          choice
            ? {
                type: 'FUNCTION_CALL',
                functionName: 'someEquals',
                arguments: [
                  { type: 'VARIABLE', path: 'selectedRecords' },
                  { type: 'LITERAL', value: choice.fieldName },
                  { type: 'LITERAL', value: choice.optionValue },
                ],
              }
            : null,
        );
      }}
    >
      <Select.Trigger size="sm" aria-label={accessibleLabel}>
        <Select.Value>
          {current?.optionLabel ?? (rule ? t`Custom` : t`All`)}
        </Select.Value>
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner align="end" alignItemWithTrigger={false}>
          <Select.Popup aria-label={accessibleLabel}>
            {items.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                disabled={item.value === 'custom'}
              >
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
