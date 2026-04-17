import { Field } from 'react-final-form'
import { Checkbox, FormControlLabel } from '@mui/material'
import { TextField } from 'mui-rff'
import { FormFieldConfig } from '../../types/frontendTypes'

type DynamicFormFieldProps = {
    name: string
    label: string
    config: FormFieldConfig
}

export const DynamicFormField = ({
    name,
    label,
    config,
}: DynamicFormFieldProps) => {
    switch (config.type) {
        case 'number':
            return (
                <TextField
                    name={name}
                    id={name}
                    label={label}
                    size="small"
                    type="number"
                />
            )

        case 'date':
            return (
                <TextField
                    name={name}
                    id={name}
                    label={label}
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                />
            )

        case 'boolean':
            return <CheckboxField name={name} label={label} />

        case 'text':
        default:
            return (
                <TextField
                    name={name}
                    id={name}
                    label={label}
                    size="small"
                    type="text"
                />
            )
    }
}

type CheckboxFieldProps = {
    name: string
    label: string
}

const CheckboxField = ({ name, label }: CheckboxFieldProps) => {
    return (
        <Field<boolean> name={name} type="checkbox">
            {({ input }) => (
                <FormControlLabel
                    label={label}
                    control={
                        <Checkbox
                            checked={!!input.value}
                            onChange={(_, checked) => input.onChange(checked)}
                            onBlur={input.onBlur}
                            onFocus={input.onFocus}
                            name={input.name}
                        />
                    }
                />
            )}
        </Field>
    )
}
