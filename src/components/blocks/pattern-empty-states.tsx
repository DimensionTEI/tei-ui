'use client';
import * as React from 'react';
import {
  AlertCircle,
  FolderOpen,
  Inbox,
  Plus,
  RefreshCcw,
  Search,
  Upload,
  WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Galería de patrones de estados vacíos. Cada función exporta un
 * EmptyState pre-configurado con icono, título, descripción y acciones
 * típicas. El consumidor importa el que necesite o copia el patrón.
 *
 * Casos cubiertos:
 *   - Lista sin items (primera vez)
 *   - Búsqueda sin resultados
 *   - Bandeja vacía
 *   - Carpeta vacía
 *   - Sin conexión / offline
 *   - Error de carga
 */

export function EmptyFirstUse({
  title = 'Aún no has creado nada',
  description = 'Empieza creando tu primer elemento. Lo tendrás visible en esta lista al instante.',
  primaryLabel = 'Crear el primero',
  onPrimary,
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
}) {
  return (
    <EmptyState
      icon={<Inbox />}
      title={title}
      description={description}
      actions={
        <Button onClick={onPrimary}>
          <Plus className="h-4 w-4" />
          {primaryLabel}
        </Button>
      }
    />
  );
}

export function EmptySearch({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search />}
      title="Sin resultados"
      description={
        query
          ? `No encontramos nada que coincida con "${query}". Prueba con otros términos o quita los filtros activos.`
          : 'No encontramos nada que coincida con tu búsqueda. Prueba con otros términos.'
      }
      actions={
        onClear && (
          <Button variant="outline" onClick={onClear}>
            Limpiar búsqueda
          </Button>
        )
      }
    />
  );
}

export function EmptyFolder({
  onUpload,
  onCreate,
}: {
  onUpload?: () => void;
  onCreate?: () => void;
}) {
  return (
    <EmptyState
      icon={<FolderOpen />}
      title="Carpeta vacía"
      description="Aún no hay archivos aquí. Súbelos arrastrándolos o crea uno nuevo."
      actions={
        <>
          {onUpload && (
            <Button variant="outline" onClick={onUpload}>
              <Upload className="h-4 w-4" />
              Subir
            </Button>
          )}
          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4" />
              Crear nuevo
            </Button>
          )}
        </>
      }
    />
  );
}

export function EmptyOffline({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<WifiOff />}
      title="Sin conexión"
      description="No podemos contactar con el servidor. Comprueba tu conexión a internet y vuelve a intentarlo."
      actions={
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          Reintentar
        </Button>
      }
    />
  );
}

export function EmptyLoadError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle />}
      title="No se pudo cargar"
      description={message ?? 'Algo falló al obtener los datos. Si persiste, abre incidencia con el equipo.'}
      actions={
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          Reintentar
        </Button>
      }
    />
  );
}

/**
 * Galería decorativa que muestra los estados juntos. Útil en docs
 * internas como referencia visual. Para producción, usa solo el que
 * necesite cada vista.
 */
export function PatternEmptyStatesGallery() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <EmptyFirstUse />
      <EmptySearch query="proyecto-2099" />
      <EmptyFolder />
      <EmptyOffline />
      <EmptyLoadError />
    </div>
  );
}
