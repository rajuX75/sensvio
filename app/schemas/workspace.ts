import z from 'zod';

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Workspace name must be at least 2 characters.' })
    .max(50, { message: 'Workspace name must be at most 50 characters.' }),
});
