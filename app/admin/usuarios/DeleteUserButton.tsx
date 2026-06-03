"use client";

export default function DeleteUserButton({
  userId,
  userName,
  eliminarUsuario,
}: {
  userId: string;
  userName: string;
  eliminarUsuario: (userId: string) => Promise<void>;
}) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm(`¿Eliminar a ${userName}?`)) {
      await eliminarUsuario(userId);
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-700"
      >
        Eliminar
      </button>
    </form>
  );
}
