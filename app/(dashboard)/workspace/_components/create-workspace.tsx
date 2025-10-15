'use client';

import { workspaceSchema, WorkspaceSchemaType } from '@/app/schemas/workspace';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { orpc } from '@/lib/orpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CreateWorkspace = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
    },
  });

  const createWorkspaceMutation = useMutation(
    orpc.workspace.create.mutationOptions({
      onSuccess: (newWorkspace) => {
        toast.success(`Workspace "${newWorkspace.workspaceName}" created successfully!`, {
          description: 'You can now start working on your new workspace.',
        });
        queryClient.invalidateQueries({
          queryKey: orpc.workspace.list.queryKey(),
        });
        form.reset();
        setOpen(false);
      },
      onError: () => {
        toast.error('Oh no! 😢', {
          description:
            'Something went wrong while creating your workspace. Please try again in a moment.',
        });
      },
    })
  );

  function onSubmit(values: WorkspaceSchemaType) {
    createWorkspaceMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group relative size-12 rounded-2xl border-2 border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary hover:bg-gradient-to-br hover:from-primary/10 hover:via-primary/5 hover:to-transparent hover:shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plus className="size-5 relative z-10 group-hover:rotate-180 transition-transform duration-500 ease-out" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="font-medium bg-gradient-to-r from-primary/90 to-primary text-primary-foreground border-0 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 animate-pulse" />
            Create Workspace
          </div>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden p-0">
        {/* Animated gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

        {/* Ambient background effects */}
        <div className="absolute top-0 right-0 size-64 bg-primary/10 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 size-64 bg-primary/5 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="p-6">
          <DialogHeader className="space-y-4 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/10">
                <Sparkles className="size-6" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text mb-1.5">
                  Create New Workspace
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  Give your workspace a unique name to get started. You can always change it later.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="size-3.5 text-primary" />
                      Workspace Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder='E.g. "Acme Corp" or "Design Team Alpha"'
                          className="h-12 border-2 border-border/50 bg-background/50 backdrop-blur-sm focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:bg-background transition-all duration-300 placeholder:text-muted-foreground/60"
                          {...field}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-2" />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-12 border-2 hover:bg-muted/50 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  disabled={createWorkspaceMutation.isPending}
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 group"
                >
                  {createWorkspaceMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Create Workspace
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Optional: Quick tips section */}
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">💡 Tip:</span> Choose a name that
              reflects your team or project. This will help others identify your workspace easily.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
