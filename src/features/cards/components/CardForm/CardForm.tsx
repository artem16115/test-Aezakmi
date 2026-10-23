import { useId, useMemo, useState } from 'react'
import { Controller, useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isoDateAgo } from '@/shared/lib/format'
import { Button, DateField, Select, TextArea, TextField } from '@/shared/ui'
import {
  ASSIGNEE_NAMES,
  ASSIGNEE_VALUES,
  PRIORITY_LABELS,
  PRIORITY_VALUES,
  STATUS_LABELS,
  STATUS_VALUES,
  toOptions,
} from '../../model/constants'
import { createCardFormSchema, type CardFormOutput, type CardFormValues } from '../../model/schema'
import { ImageDropzone } from '../ImageDropzone'
import { TagsInput } from '../TagsInput'
import styles from './CardForm.module.scss'

const PRIORITY_OPTIONS = toOptions(PRIORITY_VALUES, PRIORITY_LABELS)
const STATUS_OPTIONS = toOptions(STATUS_VALUES, STATUS_LABELS)
const ASSIGNEE_OPTIONS = toOptions(ASSIGNEE_VALUES, ASSIGNEE_NAMES)

interface CardFormProps {
  defaultValues: CardFormValues
  /** Сохранённый дедлайн редактируемой карточки — его можно оставить, даже если он в прошлом. */
  savedDeadline?: string
  submitLabel: string
  onSubmit: (data: CardFormOutput) => void
  /** Без обработчика Cancel просто сбрасывает форму. */
  onCancel?: () => void
}

/** Форма карточки — общая для создания и редактирования (экраны 3.1–3.3, 3.5). */
export function CardForm({
  defaultValues,
  savedDeadline,
  submitLabel,
  onSubmit,
  onCancel,
}: CardFormProps) {
  const id = useId()
  const [today] = useState(() => isoDateAgo({}))
  const schema = useMemo(
    () => createCardFormSchema({ today, savedDeadline }),
    [today, savedDeadline],
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormValues, unknown, CardFormOutput>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues,
  })

  const tags = useController({ control, name: 'tags' })
  const tagInput = useController({ control, name: 'tagInput' })
  // Сброс формы заодно пересоздаёт поля тегов и картинок — со своими локальными ошибками.
  const [resetCount, setResetCount] = useState(0)

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
      return
    }
    reset(defaultValues)
    setResetCount((count) => count + 1)
  }

  const minDeadline = savedDeadline && savedDeadline < today ? savedDeadline : today

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
    >
      <div className={styles.card}>
        <div className={styles.column}>
          <TextField
            label="Title"
            placeholder="Enter card title"
            required
            error={errors.title?.message}
            {...register('title')}
          />
          <TextArea
            label="Description"
            placeholder="Enter detailed description..."
            required
            error={errors.description?.message}
            {...register('description')}
          />
          <Select
            label="Priority"
            placeholder="Select priority"
            options={PRIORITY_OPTIONS}
            required
            error={errors.priority?.message}
            {...register('priority')}
          />
          <Select
            label="Status"
            placeholder="Select status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <div className={styles.column}>
          <Select
            label="Assignee"
            placeholder="Select assignee"
            options={ASSIGNEE_OPTIONS}
            error={errors.assignee?.message}
            {...register('assignee')}
          />
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <DateField
                label="Deadline"
                placeholder="Select date"
                min={minDeadline}
                error={errors.deadline?.message}
                {...field}
              />
            )}
          />
          <TagsInput
            key={`tags-${String(resetCount)}`}
            id={`${id}-tags`}
            label="Tags"
            placeholder="Add tags..."
            tags={tags.field.value}
            onTagsChange={tags.field.onChange}
            draft={tagInput.field.value}
            onDraftChange={tagInput.field.onChange}
            onBlur={tagInput.field.onBlur}
            inputRef={(element) => {
              tags.field.ref(element)
              tagInput.field.ref(element)
            }}
            error={errors.tagInput?.message ?? errors.tags?.message}
          />
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <ImageDropzone
                key={`images-${String(resetCount)}`}
                id={`${id}-images`}
                images={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                buttonRef={field.ref}
                error={errors.images?.message}
              />
            )}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
