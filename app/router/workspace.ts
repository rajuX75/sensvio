import { requiredAuthMiddleware } from '@/app/middlewares/auth';
import { base } from '@/app/middlewares/base';
import { requiredWorkspaceMiddleware } from '@/app/middlewares/workspace';
import { KindeOrganization, KindeUser } from '@kinde-oss/kinde-auth-nextjs';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { init, Organizations } from '@kinde/management-api-js';
import { z } from 'zod';
import { workspaceSchema } from '../schemas/workspace';

export const listWorkspaces = base

  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: 'GET',
    path: '/workspaces',
    summary: 'List all workspaces',
    description: 'Retrieve a list of all workspaces available to the user.',
    tags: ['workspace'],
  })
  .input(z.void())
  .output(
    z.object({
      workspaces: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        })
      ),
      user: z.custom<KindeUser<Record<string, unknown>>>(),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    })
  )
  .handler(async ({ context, errors }) => {
    const { getUserOrganizations } = getKindeServerSession();
    const organizations = await getUserOrganizations();

    if (!organizations) {
      throw errors.FORBIDDEN();
    }

    return {
      workspaces: organizations.orgs.map((org) => ({
        id: org.code,
        name: org.name ?? 'My Workspace',
        avatar: org.name?.charAt(0) ?? 'M',
      })),
      user: context.user,
      currentWorkspace: context.workspace,
    };
  });

export const createWorkspace = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: 'POST',
    path: '/workspaces',
    summary: 'Create a new workspace',
    description: 'Create a new workspace for the user.',
    tags: ['workspace'],
  })
  .input(workspaceSchema)
  .output(
    z.object({
      orgCode: z.string(),
      workspaceName: z.string(),
    })
  )
  .handler(async ({ input, context, errors }) => {
    init();
    let data;

    try {
      data = await Organizations.createOrganization({
        requestBody: {
          name: input.name,
        },
      });
    } catch (error) {
      throw errors.FORBIDDEN();
    }
    if (!data.organization?.code) {
      throw errors.FORBIDDEN({
        message: 'Organizations code is Not defined.',
      });
    }
    try {
      await Organizations.addOrganizationUsers({
        orgCode: data.organization.code,
        requestBody: {
          users: [
            {
              id: context.user.id,
              roles: ['admin'],
            },
          ],
        },
      });
    } catch (error) {
      throw errors.FORBIDDEN();
    }

    const { refreshTokens } = getKindeServerSession();
    await refreshTokens();

    return {
      orgCode: data.organization.code,
      workspaceName: input.name,
    };
  });
