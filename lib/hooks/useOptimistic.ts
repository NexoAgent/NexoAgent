import { useState, useCallback } from "react";

export interface OptimisticState<T> {
  data: T;
  isPending: boolean;
  error?: Error;
}

/**
 * Hook para actualizaciones optimistas
 *
 * Uso:
 * const { data, update, rollback } = useOptimistic(initialMessages);
 *
 * await update(newMessage, async () => {
 *   await sendToServer(newMessage);
 * });
 */
export function useOptimistic<T>(initialData: T) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isPending: false,
  });

  const update = useCallback(
    async (
      optimisticData: T,
      serverUpdate: () => Promise<T | void>
    ): Promise<boolean> => {
      // Actualización optimista inmediata
      setState({
        data: optimisticData,
        isPending: true,
      });

      try {
        // Llamada al servidor
        const serverData = await serverUpdate();

        // Actualizar con datos del servidor si los devuelve
        setState({
          data: serverData || optimisticData,
          isPending: false,
        });

        return true;
      } catch (error) {
        // Rollback en caso de error
        setState({
          data: initialData,
          isPending: false,
          error: error as Error,
        });

        return false;
      }
    },
    [initialData]
  );

  const rollback = useCallback(() => {
    setState({
      data: initialData,
      isPending: false,
    });
  }, [initialData]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: undefined }));
  }, []);

  return {
    data: state.data,
    isPending: state.isPending,
    error: state.error,
    update,
    rollback,
    clearError,
  };
}

/**
 * Hook específico para listas optimistas
 */
export function useOptimisticList<T extends { id: string }>(initialList: T[]) {
  const [list, setList] = useState(initialList);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const addOptimistic = useCallback(
    async (item: T, serverAdd: () => Promise<T | void>) => {
      // Agregar inmediatamente con estado pending
      setList((prev) => [item, ...prev]);
      setPendingIds((prev) => new Set(prev).add(item.id));

      try {
        const serverItem = await serverAdd();

        // Actualizar con datos del servidor
        if (serverItem) {
          setList((prev) =>
            prev.map((i) => (i.id === item.id ? serverItem : i))
          );
        }

        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });

        return true;
      } catch (error) {
        // Remover en caso de error
        setList((prev) => prev.filter((i) => i.id !== item.id));
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });

        return false;
      }
    },
    []
  );

  const removeOptimistic = useCallback(
    async (id: string, serverRemove: () => Promise<void>) => {
      // Guardar para rollback
      const itemToRemove = list.find((i) => i.id === id);
      if (!itemToRemove) return false;

      // Remover inmediatamente
      setList((prev) => prev.filter((i) => i.id !== id));

      try {
        await serverRemove();
        return true;
      } catch (error) {
        // Restaurar en caso de error
        setList((prev) => [itemToRemove, ...prev]);
        return false;
      }
    },
    [list]
  );

  return {
    list,
    pendingIds,
    addOptimistic,
    removeOptimistic,
    isPending: (id: string) => pendingIds.has(id),
  };
}
