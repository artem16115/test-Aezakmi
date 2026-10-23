import type { ASSIGNEE_VALUES, PRIORITY_VALUES, STATUS_VALUES } from './constants'

export type Priority = (typeof PRIORITY_VALUES)[number]
export type Status = (typeof STATUS_VALUES)[number]
export type AssigneeId = (typeof ASSIGNEE_VALUES)[number]

export interface Card {
  id: string
  title: string
  description: string
  priority: Priority
  status?: Status
  assignee?: AssigneeId
  /** 'YYYY-MM-DD' */
  deadline?: string
  tags: string[]
  /** ISO */
  createdAt: string
  /** ISO */
  updatedAt: string
}

/** Данные карточки из формы — без служебных полей. */
export type CardInput = Omit<Card, 'id' | 'createdAt' | 'updatedAt'>

/** Картинка карточки. Живёт только в памяти: в localStorage не сохраняется. */
export interface CardImage {
  id: string
  file: File
}
