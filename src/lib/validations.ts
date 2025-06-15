import { z } from 'zod';

// Base enum schemas
export const PrioritySchema = z.enum(['low', 'medium', 'high']);
export const SentimentSchema = z.enum(['positive', 'neutral', 'negative']);
export const HealthStatusSchema = z.enum(['excellent', 'good', 'at-risk', 'critical']);
export const TrendSchema = z.enum(['up', 'down', 'stable']);
export const ActionStatusSchema = z.enum(['pending', 'in-progress', 'completed', 'cancelled']);

// Conversation schema
export const ConversationSchema = z.object({
  id: z.string().min(1),
  clientId: z.string().min(1),
  client: z.string().min(1),
  subject: z.string().min(1).max(200),
  preview: z.string().min(1).max(500),
  fullContent: z.string().optional(),
  timestamp: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  priority: PrioritySchema,
  sentiment: SentimentSchema,
  unread: z.boolean(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
});

// Client schema
export const ClientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().min(1).max(100),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
  healthScore: z.object({
    score: z.number().min(0).max(100),
    trend: TrendSchema,
    status: HealthStatusSchema,
    lastActivity: z.string(),
    issues: z.number().min(0),
    lastUpdated: z.date(),
  }),
  contractInfo: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    value: z.number().positive().optional(),
    renewalDate: z.date().optional(),
  }),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Email Summary schema
export const EmailSummarySchema = z.object({
  id: z.string().min(1),
  conversationId: z.string().min(1),
  originalEmail: z.string().min(1),
  tldr: z.array(z.string().min(1)),
  actions: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.date().optional(),
    priority: PrioritySchema,
    status: ActionStatusSchema,
    assignedTo: z.string().optional(),
    conversationId: z.string().optional(),
    clientId: z.string().optional(),
    createdAt: z.date(),
    completedAt: z.date().optional(),
  })),
  sentiment: SentimentSchema,
  createdAt: z.date(),
  createdBy: z.string().optional(),
});

// Action Item schema
export const ActionItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: PrioritySchema,
  status: ActionStatusSchema,
  assignedTo: z.string().optional(),
  conversationId: z.string().optional(),
  clientId: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

// Response Template schema
export const ResponseTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  subject: z.string().max(200).optional(),
  content: z.string().min(1),
  variables: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  usageCount: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User Settings schema
export const UserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    desktop: z.boolean(),
    sound: z.boolean(),
  }),
  preferences: z.object({
    defaultPriority: PrioritySchema,
    autoSave: z.boolean(),
    compactView: z.boolean(),
  }),
  apiKeys: z.object({
    openai: z.string().optional(),
  }),
  updatedAt: z.date(),
});

// Form validation schemas
export const ConversationFormSchema = z.object({
  client: z.string().min(1, 'Client name is required'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  content: z.string().min(1, 'Email content is required'),
  priority: PrioritySchema,
  tags: z.array(z.string()).optional(),
});

export const ClientFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required'),
  company: z.string().min(1, 'Company is required').max(100, 'Company name must be less than 100 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const ActionItemFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO string for forms
  priority: PrioritySchema,
  assignedTo: z.string().optional(),
});

// Filter schemas
export const ConversationFiltersSchema = z.object({
  client: z.string().optional(),
  priority: PrioritySchema.optional(),
  sentiment: SentimentSchema.optional(),
  unread: z.boolean().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  tags: z.array(z.string()).optional(),
});

export const ClientFiltersSchema = z.object({
  healthStatus: HealthStatusSchema.optional(),
  trend: TrendSchema.optional(),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
});

// Utility validation functions
export function validateConversation(data: unknown) {
  return ConversationSchema.safeParse(data);
}

export function validateClient(data: unknown) {
  return ClientSchema.safeParse(data);
}

export function validateActionItem(data: unknown) {
  return ActionItemSchema.safeParse(data);
}

export function validateUserSettings(data: unknown) {
  return UserSettingsSchema.safeParse(data);
}

// Form validation helpers
export function validateConversationForm(data: unknown) {
  return ConversationFormSchema.safeParse(data);
}

export function validateClientForm(data: unknown) {
  return ClientFormSchema.safeParse(data);
}

export function validateActionItemForm(data: unknown) {
  return ActionItemFormSchema.safeParse(data);
}

// Type inference from schemas
export type ConversationFormData = z.infer<typeof ConversationFormSchema>;
export type ClientFormData = z.infer<typeof ClientFormSchema>;
export type ActionItemFormData = z.infer<typeof ActionItemFormSchema>;
export type ConversationFiltersData = z.infer<typeof ConversationFiltersSchema>;
export type ClientFiltersData = z.infer<typeof ClientFiltersSchema>; 