import * as React from "react"
import type { FormProps as RemixFormProps } from "@remix-run/react"
import { Form as RemixForm, useActionData, useTransition } from "@remix-run/react"

import type { ActionData } from "~/lib/form"
import { createImageUrl } from "~/lib/s3"
import { merge } from "~/lib/tailwind"

import { BrandButton } from "./BrandButton"
import { type ButtonProps } from "./Button"
import { ImageUploader } from "./ImageUploader"
import { Input, type InputProps } from "./Inputs"

export const Form = React.forwardRef(function _Form(props: RemixFormProps, ref: React.ForwardedRef<HTMLFormElement> | null) {
  const form = useActionData<ActionData<any>>()
  return (
    <RemixForm aria-describedby="form-error" aria-invalid={form?.formError ? true : undefined} ref={ref} {...props}>
      {props.children}
    </RemixForm>
  )
})

export function FormFieldLabel(
  props: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> & {
    name?: string
    required?: boolean
  },
) {
  return (
    <label
      htmlFor={props.name}
      {...props}
      className={merge("flex text-sm font-medium text-gray-900 dark:text-gray-50", props.className)}
    >
      {props.children}
      {props.required && <span className="text-red-500">*</span>}
    </label>
  )
}
export function FormFieldError(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) {
  return (
    <p {...props} className={merge("text-sm text-red-400", props.className)}>
      {props.children}
    </p>
  )
}

interface FormFieldProps extends InputProps {
  name: string
  label?: string
  input?: React.ReactElement
  defaultValue?: any
  errors?: string | string[] | null
  shouldPassProps?: boolean
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, errors, input, ...props },
  ref,
) {
  const form = useActionData<ActionData<any>>()
  const fieldErrors = errors || form?.fieldErrors?.[props.name]
  const className = merge(props.className, fieldErrors && "border-red-500 focus:border-red-500")
  const sharedProps = {
    "aria-invalid": fieldErrors || fieldErrors?.length ? true : undefined,
    "aria-errormessage": props.name + "-error",
    id: props.name,
    defaultValue: form?.data?.[props.name],
    ...props,
    ref,
    name: props.name,
    className,
  }

  const clonedInput = input && React.cloneElement(input, sharedProps)
  return (
    <div>
      {label && (
        <FormFieldLabel name={props.name} required={props.required}>
          {label}
        </FormFieldLabel>
      )}
      {clonedInput || <Input size="sm" {...sharedProps} />}

      {typeof fieldErrors === "string" ? (
        <FormFieldError>{fieldErrors}</FormFieldError>
      ) : (
        fieldErrors?.length && (
          <ul id={props.name + "-error"}>
            {fieldErrors?.map((error, i) => (
              <FormFieldError key={i}>{error}</FormFieldError>
            ))}
          </ul>
        )
      )}
    </div>
  )
})
export const InlineFormField = React.forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, errors, input, shouldPassProps = true, ...props },
  ref,
) {
  const form = useActionData<ActionData<any>>()
  const fieldErrors = errors || form?.fieldErrors?.[props.name]
  const className = merge(props.className, fieldErrors && "border-red-500 focus:border-red-500")
  const sharedProps = shouldPassProps
    ? {
        "aria-invalid": fieldErrors || fieldErrors?.length ? true : undefined,
        "aria-errormessage": props.name + "-error",
        id: props.name,
        ref,
        defaultValue: form?.data?.[props.name],
        ...props,
        name: props.name,
        className,
      }
    : {}
  const clonedInput = input && React.cloneElement(input, sharedProps)
  return (
    <div className="w-full">
      <div className="flex flex-col space-x-0 md:flex-row md:space-x-3">
        {label && (
          <div className="w-min-content">
            <FormFieldLabel name={props.name} required={props.required} className="w-24">
              {label}
            </FormFieldLabel>
          </div>
        )}
        {clonedInput || <Input size="sm" {...sharedProps} />}
      </div>
      {typeof fieldErrors === "string" ? (
        <FormFieldError>{fieldErrors}</FormFieldError>
      ) : (
        fieldErrors?.length && (
          <ul id={props.name + "-error"}>
            {fieldErrors?.map((error, i) => (
              <FormFieldError key={i}>{error}</FormFieldError>
            ))}
          </ul>
        )
      )}
    </div>
  )
})

interface ImageFieldProps {
  path: string
  className?: string
  name: string
  label?: string
  errors?: string | string[] | null
  defaultValue?: string | null | undefined
  required?: boolean
  placeholder?: string
}

export function ImageField(props: ImageFieldProps) {
  const form = useActionData<ActionData<any>>()
  const [image, setImage] = React.useState(props.defaultValue)
  const fieldErrors = props.errors || form?.fieldErrors?.[props.name]
  return (
    <div>
      {props.label && (
        <FormFieldLabel name={props.name} required={props.required}>
          {props.label}
        </FormFieldLabel>
      )}
      <div>
        <ImageUploader
          onSubmit={setImage}
          path={props.path}
          className={merge("h-48 w-full cursor-pointer object-cover hover:opacity-80", props.className)}
        >
          {image ? (
            <img src={createImageUrl(image)} className="h-full w-full object-contain" alt="preview" />
          ) : (
            <div className="center h-full w-full">
              <p className="text-center text-gray-500">{props.placeholder || "Upload an image"}</p>
            </div>
          )}
        </ImageUploader>
        <input type="hidden" value={image || ""} name={props.name} />
      </div>
      {typeof fieldErrors === "string" ? (
        <FormFieldError>{fieldErrors}</FormFieldError>
      ) : (
        fieldErrors?.length && (
          <ul id={props.name + "-error"}>
            {fieldErrors?.map((error, i) => (
              <FormFieldError key={i}>{error}</FormFieldError>
            ))}
          </ul>
        )
      )}
    </div>
  )
}

export function FormError({ error }: { error?: string }) {
  const form = useActionData<ActionData<any>>()
  if (!form?.formError && !error) return null
  return <FormFieldError id="form-error">{form?.formError || error}</FormFieldError>
}
export const FormButton = React.forwardRef<HTMLButtonElement, ButtonProps>(function _FormButton(props, ref) {
  const transition = useTransition()
  return <BrandButton type="submit" isLoading={transition.state === "submitting"} {...props} ref={ref} />
})
