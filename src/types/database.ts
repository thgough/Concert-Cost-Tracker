export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      concerts: {
        Row: {
          artist: string;
          city: string;
          concert_date: string;
          concert_name: string;
          created_at: string;
          distance_from_home: number;
          food_drink_cost: number;
          fun_rating: number;
          hours_at_event: number;
          id: string;
          lodging_cost: number;
          merchandise_cost: number;
          notes: string | null;
          other_cost: number;
          parking_cost: number;
          state: string;
          ticket_cost: number;
          ticket_fees: number;
          travel_cost: number;
          user_id: string;
          venue: string;
        };
        Insert: {
          artist: string;
          city: string;
          concert_date: string;
          concert_name: string;
          created_at?: string;
          distance_from_home?: number;
          food_drink_cost?: number;
          fun_rating: number;
          hours_at_event?: number;
          id?: string;
          lodging_cost?: number;
          merchandise_cost?: number;
          notes?: string | null;
          other_cost?: number;
          parking_cost?: number;
          state: string;
          ticket_cost?: number;
          ticket_fees?: number;
          travel_cost?: number;
          user_id: string;
          venue: string;
        };
        Update: {
          artist?: string;
          city?: string;
          concert_date?: string;
          concert_name?: string;
          created_at?: string;
          distance_from_home?: number;
          food_drink_cost?: number;
          fun_rating?: number;
          hours_at_event?: number;
          id?: string;
          lodging_cost?: number;
          merchandise_cost?: number;
          notes?: string | null;
          other_cost?: number;
          parking_cost?: number;
          state?: string;
          ticket_cost?: number;
          ticket_fees?: number;
          travel_cost?: number;
          user_id?: string;
          venue?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Concert = Database["public"]["Tables"]["concerts"]["Row"];
export type ConcertInsert = Database["public"]["Tables"]["concerts"]["Insert"];
