import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";

export default function useReviews() {
  const [state, setState] = useState({
    reviews: [],
    isLoading: false,
    error: null,
    source: isSupabaseConfigured ? "supabase" : "not-configured",
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    const loadReviews = async () => {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      const { data, error } = await supabase
        .from("homepage_reviews")
        .select("id, author, label, text, time, rating, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(12);

      if (!isMounted) {
        return;
      }

      setState({
        reviews: data ?? [],
        isLoading: false,
        error: error?.message ?? null,
        source: "supabase",
      });
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
