import apiClient, { resOk } from "./apiClient";
import type { OptionLeg } from "./options";

export interface SavedStrategy {
  id: string;
  name: string;
  legs: OptionLeg[];
  stockSymbol?: string;
  // createdAt: string;
  // updatedAt: string;
}

export async function saveStrategy(name: string, legs: OptionLeg[], stockSymbol: string): Promise<SavedStrategy> {

    const response = await apiClient.post(
      "/strategies",
      {
        name: name,
        legs: legs,
        stockSymbol: stockSymbol
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!resOk(response.status)) {
      throw new Error("Unable to save strategy");
    }

    const savedStrategy: SavedStrategy = response.data;

    // console.log(JSON.stringify(savedStrategy));

    return savedStrategy;
}

export async function createPriceAlert(stockSymbol: string, targetPrice: number): Promise<void> {
  const response = await apiClient.post(
    "/alerts",
    {
      stockSymbol: stockSymbol.toUpperCase(),
      targetPrice: targetPrice,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  if (!resOk(response.status)) {
    throw new Error("Unable to create price alert");
  }
  const alert = response.data;
  return alert
}

export async function loadStrategies(): Promise<SavedStrategy[]> {

  const response = await apiClient.get("/strategies");

  if (!resOk(response.status)) {
    throw new Error("Unable to load saved strategies");
  }

  const savedStrategies: SavedStrategy[] = response.data;

  // console.log(JSON.stringify(savedStrategies));

  return savedStrategies;
}

export async function deleteStrategy(id: string): Promise<void> {

    const response = await apiClient.delete(
      `/strategies/${id}`
    );

    if (!resOk(response.status)) {
      throw new Error("Unable to delete strategy");
    }
}

// export async function updateStrategy(id: string, name: string, legs: OptionLeg[]): Promise<SavedStrategy> {

//   // Fallback: localStorage for development
//   const strategies = getStrategiesFromStorage();
//   const index = strategies.findIndex((s) => s.id === id);
//   if (index !== -1) {
//     strategies[index] = {
//       ...strategies[index],
//       name,
//       legs,
//       updatedAt: new Date().toISOString(),
//     };
//     localStorage.setItem("savedStrategies", JSON.stringify(strategies));
//     return strategies[index];
//   }
//   throw new Error("Strategy not found");
// }

// // Helper function for localStorage fallback
// function getStrategiesFromStorage(): SavedStrategy[] {
//   try {
//     const stored = localStorage.getItem("savedStrategies");
//     return stored ? JSON.parse(stored) : [];
//   } catch {
//     return [];
//   }
// }
