"use client";

import { useEffect } from "react";

/**
 * Componente que escucha mensajes del Service Worker
 * y reproduce sonidos de notificaciones
 *
 * Este componente debe estar montado en el layout principal
 */
export default function NotificationSoundPlayer() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Escuchar mensajes del Service Worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "PLAY_SOUND") {
        playSound(event.data.sound);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const playSound = (soundPath: string) => {
    if (!soundPath) return;

    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.7; // 70% de volumen

      // Intentar reproducir
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Silenciar error si el usuario no ha interactuado
          // (algunos navegadores requieren interacción del usuario primero)
          console.log("No se pudo reproducir el sonido automáticamente:", error.message);
        });
      }
    } catch (error) {
      console.error("Error reproduciendo sonido:", error);
    }
  };

  // Este componente no renderiza nada visible
  return null;
}
