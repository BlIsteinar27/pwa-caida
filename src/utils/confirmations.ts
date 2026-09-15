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
      popup:
        "bg-white/90 backdrop-blur-md border border-purple-200 rounded-lg shadow-xl",
      title: "text-gray-800 font-bold text-lg",
      htmlContainer: "text-gray-600",
      confirmButton:
        "bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded",
      actions: "gap-2 flex flex-row-reverse",
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
      popup:
        "bg-white/90 backdrop-blur-md border border-purple-200 rounded-lg shadow-xl",
      title: "text-gray-800 font-bold text-lg",
      htmlContainer: "text-gray-600",
      confirmButton:
        "bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded",
      actions: "gap-2 flex flex-row-reverse",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};

export const confirmResetPoints = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "¿Reiniciar puntos?",
    text: "Se reiniciarán los puntos de la partida actual",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
    customClass: {
      popup:
        "bg-white/90 backdrop-blur-md border border-purple-200 rounded-lg shadow-xl",
      title: "text-gray-800 font-bold text-lg",
      htmlContainer: "text-gray-600",
      confirmButton:
        "bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded",
      actions: "gap-2 flex flex-row-reverse",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
};
