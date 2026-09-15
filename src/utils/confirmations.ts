import Swal from "sweetalert2";

export const confirmResetSeries = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Reiniciar serie?",
    text: "Se perderán todas las victorias acumuladas",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl",
      title: "text-white font-bold text-lg",
      htmlContainer: "text-zinc-300",
      confirmButton:
        "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};

export const confirmResetAll = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Reiniciar todo?",
    text: "Se perderá toda la configuración y progreso",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl",
      title: "text-white font-bold text-lg",
      htmlContainer: "text-zinc-300",
      confirmButton:
        "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};
