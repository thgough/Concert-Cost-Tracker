import BudgetGoals from "@/components/budget/BudgetGoals";
import PageHeader from "@/components/PageHeader";
import { getBudget } from "@/lib/get-budget";
import { getConcerts } from "@/lib/get-concerts";
import { createClient } from "@/lib/supabase/server";

export default async function BudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [concerts, budget] = await Promise.all([getConcerts(), getBudget()]);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Budget"
        subtitle="Set a yearly concert budget and track spending against your goal."
      />
      {user && (
        <BudgetGoals concerts={concerts} budget={budget} userId={user.id} />
      )}
    </div>
  );
}
