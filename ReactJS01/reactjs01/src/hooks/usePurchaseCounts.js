import { useState, useEffect } from "react";
import { getAllPurchaseCountsApi } from "../util/api";

const usePurchaseCounts = () => {
  const [purchaseCounts, setPurchaseCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPurchaseCounts = async () => {
    try {
      const res = await getAllPurchaseCountsApi();
      if (res && res.counts) {
        setPurchaseCounts(res.counts);
      }
    } catch (error) {
      console.error("Error fetching purchase counts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseCounts();
  }, []);

  return { purchaseCounts, loading, refetch: fetchPurchaseCounts };
};

export default usePurchaseCounts;
