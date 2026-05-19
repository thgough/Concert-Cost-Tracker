"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { ConcertInsert } from "@/types/database";
import { formatCurrency, totalCost } from "@/lib/concert-metrics";
import { funBadgeClass } from "@/lib/fun-badge";
import FormField from "@/components/FormField";
import MoneyInput from "@/components/MoneyInput";

const emptyForm = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "0",
  hours_at_event: "3",
  ticket_cost: "0",
  ticket_fees: "0",
  parking_cost: "0",
  food_drink_cost: "0",
  merchandise_cost: "0",
  lodging_cost: "0",
  travel_cost: "0",
  other_cost: "0",
  fun_rating: "7",
  notes: "",
};

const COST_FIELDS = [
  ["ticket_cost", "Ticket cost"],
  ["ticket_fees", "Ticket fees"],
  ["parking_cost", "Parking"],
  ["food_drink_cost", "Food & drink"],
  ["merchandise_cost", "Merchandise"],
  ["lodging_cost", "Hotel / lodging"],
  ["travel_cost", "Travel / gas"],
  ["other_cost", "Other"],
] as const;

export default function ConcertForm() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const costPreview = useMemo(
    () =>
      totalCost({
        ticket_cost: Number(form.ticket_cost) || 0,
        ticket_fees: Number(form.ticket_fees) || 0,
        parking_cost: Number(form.parking_cost) || 0,
        food_drink_cost: Number(form.food_drink_cost) || 0,
        merchandise_cost: Number(form.merchandise_cost) || 0,
        lodging_cost: Number(form.lodging_cost) || 0,
        travel_cost: Number(form.travel_cost) || 0,
        other_cost: Number(form.other_cost) || 0,
      }),
    [form]
  );

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hours = Number(form.hours_at_event);
    if (!hours || hours <= 0) {
      setError("Hours at the event must be greater than zero.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to save a concert.");
      setLoading(false);
      return;
    }

    const row: ConcertInsert = {
      user_id: user.id,
      concert_name: form.concert_name.trim(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      concert_date: form.concert_date,
      distance_from_home: Number(form.distance_from_home) || 0,
      hours_at_event: hours,
      ticket_cost: Number(form.ticket_cost) || 0,
      ticket_fees: Number(form.ticket_fees) || 0,
      parking_cost: Number(form.parking_cost) || 0,
      food_drink_cost: Number(form.food_drink_cost) || 0,
      merchandise_cost: Number(form.merchandise_cost) || 0,
      lodging_cost: Number(form.lodging_cost) || 0,
      travel_cost: Number(form.travel_cost) || 0,
      other_cost: Number(form.other_cost) || 0,
      fun_rating: Number(form.fun_rating),
      notes: form.notes.trim() || null,
    };

    const { error: insertError } = await supabase.from("concerts").insert([row]);

    setLoading(false);

    if (insertError) {
      toast.error(insertError.message);
      return;
    }

    setForm(emptyForm);
    toast.success("Concert saved! Add another or check your dashboard.");
    router.refresh();
  }

  const funRating = Number(form.fun_rating);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 rounded-2xl shadow-sm border border-base-300">
        <div className="card-body space-y-3">
          <h2 className="card-title text-xl">Concert details</h2>
          <FormField label="Concert name" htmlFor="concert_name">
            <input
              id="concert_name"
              className="input input-bordered w-full"
              value={form.concert_name}
              onChange={(e) => update("concert_name", e.target.value)}
              required
            />
          </FormField>
          <FormField label="Artist / band" htmlFor="artist">
            <input
              id="artist"
              className="input input-bordered w-full"
              value={form.artist}
              onChange={(e) => update("artist", e.target.value)}
              required
            />
          </FormField>
          <FormField label="Venue" htmlFor="venue">
            <input
              id="venue"
              className="input input-bordered w-full"
              value={form.venue}
              onChange={(e) => update("venue", e.target.value)}
              required
            />
          </FormField>
          <FormField label="City" htmlFor="city">
            <input
              id="city"
              className="input input-bordered w-full"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              required
            />
          </FormField>
          <FormField label="State" htmlFor="state">
            <input
              id="state"
              className="input input-bordered w-full"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              required
            />
          </FormField>
          <FormField label="Concert date" htmlFor="concert_date">
            <input
              id="concert_date"
              type="date"
              className="input input-bordered w-full"
              value={form.concert_date}
              onChange={(e) => update("concert_date", e.target.value)}
              required
            />
          </FormField>
          <FormField
            label="Distance (mi)"
            htmlFor="distance_from_home"
            hint="Miles from home — stay consistent each time you log."
          >
            <input
              id="distance_from_home"
              type="number"
              min="0"
              step="0.1"
              className="input input-bordered w-full"
              value={form.distance_from_home}
              onChange={(e) => update("distance_from_home", e.target.value)}
            />
          </FormField>
          <FormField
            label="Hours at event"
            htmlFor="hours_at_event"
            hint="Include travel time at the venue if you like."
          >
            <input
              id="hours_at_event"
              type="number"
              min="0.5"
              step="0.5"
              className="input input-bordered w-full"
              value={form.hours_at_event}
              onChange={(e) => update("hours_at_event", e.target.value)}
              required
            />
          </FormField>
          <FormField label="Notes" htmlFor="notes">
            <textarea
              id="notes"
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Memories, who you went with, surprises…"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </FormField>
        </div>
      </div>

      <div className="card bg-base-100 rounded-2xl shadow-sm border border-base-300">
        <div className="card-body space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title text-xl">Costs</h2>
            <div className="badge badge-primary badge-lg tabular-nums">
              Total: {formatCurrency(costPreview)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            {COST_FIELDS.map(([key, label]) => (
              <FormField key={key} label={label} htmlFor={key}>
                <MoneyInput
                  id={key}
                  value={form[key]}
                  onChange={(v) => update(key, v)}
                />
              </FormField>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 rounded-2xl shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-xl">How fun was it?</h2>
          <div className="flex items-center gap-4 mt-4">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              className="range range-primary flex-1"
              value={form.fun_rating}
              onChange={(e) => update("fun_rating", e.target.value)}
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={funRating}
            />
            <span
              className={`badge badge-lg ${funBadgeClass(funRating)} tabular-nums`}
            >
              {form.fun_rating}
            </span>
          </div>
          <div className="flex justify-between text-xs opacity-70 mt-2 px-1">
            <span>Terrible Time</span>
            <span>Best Time Ever</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-full gap-2 active:scale-[0.98] transition-transform"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner loading-sm" />}
        {loading ? "Saving…" : "Save concert"}
      </button>
    </form>
  );
}
