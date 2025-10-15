import { base } from '@/app/middlewares/base';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export const requiredAuthMiddleware = base
  .$context<{
    session?: { user?: KindeUser<Record<string, unknown>> };
  }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession());

    const user = session?.user;

    if (!user) {
      return redirect('/api/auth/login');
    }

    // Now user is definitely KindeUser, not undefined
    return next({
      context: { user: user as KindeUser<Record<string, unknown>> },
    });
  });

const getSession = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return {
    user: user ?? undefined,
  };
};
