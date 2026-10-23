import { z } from 'zod'
import { ASSIGNEE_VALUES, LIMITS, MESSAGES, PRIORITY_VALUES, STATUS_VALUES } from './constants'
import { isImageFile } from './images'
import { validateNewTag } from './tags'
import type { Card, CardImage } from './types'

// --- Хранение: карточки из localStorage проверяются этой схемой ---

export const cardSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  description: z.string(),
  priority: z.enum(PRIORITY_VALUES),
  status: z.enum(STATUS_VALUES).optional(),
  assignee: z.enum(ASSIGNEE_VALUES).optional(),
  deadline: z.iso.date().optional(),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const storedCardsSchema = z.array(cardSchema)

// --- Форма ---

/** Пустой вариант селекта ('') → undefined в результате. */
const optionalChoice = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.literal(''), z.enum(values)]).transform((value) => value || undefined)

const imagesSchema = z
  .array(z.object({ id: z.string(), file: z.instanceof(File) }))
  .max(LIMITS.images, MESSAGES.tooManyImages)
  .refine((images) => images.every(({ file }) => isImageFile(file)), MESSAGES.imageType)
  .refine(
    (images) => images.every(({ file }) => file.size <= LIMITS.imageBytes),
    MESSAGES.imageTooLarge,
  )

const tagsSchema = z
  .array(z.string().trim().min(1).max(LIMITS.tagLength, MESSAGES.tagTooLong))
  .max(LIMITS.tags, MESSAGES.tooManyTags)
  .refine(
    (tags) => new Set(tags.map((tag) => tag.toLowerCase())).size === tags.length,
    MESSAGES.tagDuplicate,
  )

interface CardFormSchemaOptions {
  /** Сегодняшняя дата 'YYYY-MM-DD' — дедлайн не может быть раньше. */
  today: string
  /** Уже сохранённый дедлайн редактируемой карточки: его оставить можно, даже если он в прошлом. */
  savedDeadline?: string
}

export function createCardFormSchema({ today, savedDeadline }: CardFormSchemaOptions) {
  const base = z.object({
    title: z
      .string()
      .trim()
      .min(1, MESSAGES.titleRequired)
      .max(LIMITS.title, MESSAGES.titleTooLong),
    description: z
      .string()
      .trim()
      .min(1, MESSAGES.descriptionRequired)
      .max(LIMITS.description, MESSAGES.descriptionTooLong),
    priority: z
      .union([z.literal(''), z.enum(PRIORITY_VALUES)])
      .pipe(z.enum(PRIORITY_VALUES, MESSAGES.priorityRequired)),
    status: optionalChoice(STATUS_VALUES),
    assignee: optionalChoice(ASSIGNEE_VALUES),
    deadline: z
      .union([z.literal(''), z.iso.date()])
      .refine((date) => !date || date >= today || date === savedDeadline, MESSAGES.deadlineInPast)
      .transform((date) => date || undefined),
    tags: tagsSchema,
    /** Недописанный тег в инпуте: при отправке он не теряется, а добавляется к тегам. */
    tagInput: z.string(),
    images: imagesSchema,
  })

  return base
    .superRefine(
      ({ tags, tagInput }, ctx) => {
        const draft = tagInput.trim()
        const error = draft && validateNewTag(draft, tags)
        if (error) ctx.addIssue({ code: 'custom', path: ['tagInput'], message: error })
      },
      // Проверяем черновик тега, даже если в других полях есть ошибки.
      { when: ({ value }) => base.pick({ tags: true, tagInput: true }).safeParse(value).success },
    )
    .transform(({ tagInput, tags, ...rest }) => {
      const draft = tagInput.trim()
      return { ...rest, tags: draft ? [...tags, draft] : tags }
    })
}

export type CardFormSchema = ReturnType<typeof createCardFormSchema>
export type CardFormValues = z.input<CardFormSchema>
export type CardFormOutput = z.output<CardFormSchema>

export const emptyCardFormValues = (): CardFormValues => ({
  title: '',
  description: '',
  priority: '',
  status: '',
  assignee: '',
  deadline: '',
  tags: [],
  tagInput: '',
  images: [],
})

/** Значения формы редактирования из сохранённой карточки (+ картинки из памяти, если есть). */
export const cardToFormValues = (card: Card, images: readonly CardImage[]): CardFormValues => ({
  title: card.title,
  description: card.description,
  priority: card.priority,
  status: card.status ?? '',
  assignee: card.assignee ?? '',
  deadline: card.deadline ?? '',
  tags: [...card.tags],
  tagInput: '',
  images: [...images],
})
