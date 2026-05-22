import { AppLoadingState } from "@/components/app-state/app-loading-state";

export default function Loading() {
  return (
    <div className="flex-1 w-full bg-background py-8">
      <AppLoadingState label="Cargando SoyUpwork..." />
    </div>
  );
}
