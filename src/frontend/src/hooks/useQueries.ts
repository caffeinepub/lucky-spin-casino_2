import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GameResult, Profile, Transaction } from "../backend.d";
import { useActor } from "./useActor";

export function useBalance() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["balance"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getBalance();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useTopPlayers() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile[]>({
    queryKey: ["topPlayers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecentWins() {
  const { actor, isFetching } = useActor();
  return useQuery<GameResult[]>({
    queryKey: ["recentWins"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentWins();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitGameResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      game,
      won,
      amount,
    }: { game: string; won: boolean; amount: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitGameResult(game, won, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["recentWins"] });
    },
  });
}
