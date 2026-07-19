import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";

const REVIEW_LIMIT = 20;
const REVIEW_REFRESH_INTERVAL_MS = 60000;

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

    const loadReviews = async ({ showLoading = false } = {}) => {
      if (showLoading) {
        setState((current) => ({ ...current, isLoading: true, error: null }));
      }

      const { data, error } = await supabase
        .from("homepage_reviews")
        .select("id, author, label, text, time, rating, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(REVIEW_LIMIT);

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

    loadReviews({ showLoading: true });
    const refreshTimer = window.setInterval(() => {
      loadReviews();
    }, REVIEW_REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  return state;
}
