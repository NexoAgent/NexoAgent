"use client";

import FloatingActionButton from "./mobile/FloatingActionButton";
import { useRouter } from "next/navigation";

export default function ConversacionesMobileActions({ empresaId }: { empresaId: string }) {
  const router = useRouter();

  return (
    <FloatingActionButton
      actions={[
        {
          icon: "🔍",
          label: "Buscar",
          onClick: () => {
            // Trigger global search
            const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
            document.dispatchEvent(event);
          },
        },
        {
          icon: "🔄",
          label: "Actualizar",
          onClick: () => router.refresh(),
        },
      ]}
    />
  );
}
