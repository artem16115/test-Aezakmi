import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { LIMITS, MESSAGES } from './constants'
import { createCardFormSchema, emptyCardFormValues, type CardFormValues } from './schema'

const TODAY = '2026-03-30'

const valid = (overrides: Partial<CardFormValues> = {}): CardFormValues => ({
  ...emptyCardFormValues(),
  title: 'Website Redesign',
  description: 'Redesign the landing page',
  priority: 'high',
  ...overrides,
})

const errorsOf = (values: CardFormValues, savedDeadline?: string) => {
  const result = createCardFormSchema({ today: TODAY, savedDeadline }).safeParse(values)
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}

const image = (name: string, type: string, size = 1024) => ({
  id: name,
  file: new File([new Uint8Array(size)], name, { type }),
})

describe('createCardFormSchema', () => {
  it('пустая форма — ошибки обязательных полей', () => {
    expect(errorsOf(emptyCardFormValues())).toEqual({
      title: [MESSAGES.titleRequired],
      description: [MESSAGES.descriptionRequired],
      priority: [MESSAGES.priorityRequired],
    })
  })

  it('только пробелы в названии — как пустое', () => {
    expect(errorsOf(valid({ title: '   ' }))).toEqual({ title: [MESSAGES.titleRequired] })
  })

  it('ограничения длины названия и описания', () => {
    expect(
      errorsOf(
        valid({
          title: 'a'.repeat(LIMITS.title + 1),
          description: 'a'.repeat(LIMITS.description + 1),
        }),
      ),
    ).toEqual({
      title: ['Title must be at most 100 characters'],
      description: ['Description must be at most 1000 characters'],
    })
  })

  it('дедлайн: прошлое — ошибка, сегодня — можно, сохранённый прошлый — можно', () => {
    expect(errorsOf(valid({ deadline: '2026-03-29' }))).toEqual({
      deadline: [MESSAGES.deadlineInPast],
    })
    expect(errorsOf(valid({ deadline: TODAY }))).toEqual({})
    expect(errorsOf(valid({ deadline: '2026-03-01' }), '2026-03-01')).toEqual({})
  })

  it('теги: дубликат без учёта регистра, лимит количества', () => {
    expect(errorsOf(valid({ tags: ['Design', 'design'] }))).toEqual({
      tags: [MESSAGES.tagDuplicate],
    })
    const tooMany = Array.from({ length: LIMITS.tags + 1 }, (_, index) => `tag${String(index)}`)
    expect(errorsOf(valid({ tags: tooMany }))).toEqual({ tags: ['Maximum 10 tags'] })
  })

  it('недописанный тег проверяется и при успехе добавляется к тегам', () => {
    expect(errorsOf(valid({ tags: ['design'], tagInput: 'DESIGN' }))).toEqual({
      tagInput: [MESSAGES.tagDuplicate],
    })
    expect(errorsOf(valid({ tagInput: 'a'.repeat(LIMITS.tagLength + 1) }))).toEqual({
      tagInput: ['Tag must be at most 20 characters'],
    })

    const result = createCardFormSchema({ today: TODAY }).parse(
      valid({ tags: ['design'], tagInput: '  frontend ' }),
    )
    expect(result.tags).toEqual(['design', 'frontend'])
  })

  it('картинки: только изображения, не больше 5 МБ', () => {
    expect(errorsOf(valid({ images: [image('doc.pdf', 'application/pdf')] }))).toEqual({
      images: [MESSAGES.imageType],
    })
    expect(
      errorsOf(valid({ images: [image('big.png', 'image/png', LIMITS.imageBytes + 1)] })),
    ).toEqual({ images: ['Each image must be 5 MB or less'] })
  })

  it('пустые необязательные поля превращаются в undefined', () => {
    const result = createCardFormSchema({ today: TODAY }).parse(valid())
    expect(result).toMatchObject({
      title: 'Website Redesign',
      priority: 'high',
      status: undefined,
      assignee: undefined,
      deadline: undefined,
      tags: [],
    })
    expect(result).not.toHaveProperty('tagInput')
  })
})
