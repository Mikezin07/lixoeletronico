import { useState, useEffect } from "react";
import api from "../services/api";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get(url)
      .then((r) => {
        if (mounted) setData(r.data);
      })
      .catch((e) => {
        if (mounted) setError(e);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [url]);

  return { data, loading, error };
}
