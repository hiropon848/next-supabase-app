import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
        <h1 className="font-bold">Dashboard</h1>
        <form action={signOut}>
          <Button variant="ghost" size="sm">
            Logout
          </Button>
        </form>
      </header>
      <main className="p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">You are logged in as:</p>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {user.email}
            </code>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
