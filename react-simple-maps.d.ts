import { ReactNode, SVGAttributes } from "react";

export interface ComposableMapProps extends SVGAttributes<SVGSVGElement> {}
export const ComposableMap: React.FC<ComposableMapProps>;

export interface GeographiesProps {
  geography: string | object;
  children: (geographies: any[]) => ReactNode;
}
export const Geographies: React.FC<GeographiesProps>;

export interface GeographyProps extends SVGAttributes<SVGPathElement> {
  geography: string | object;
  fill?: string;
  stroke?: string;
  children?: ReactNode;
}
export const Geography: React.FC<GeographyProps>;

export interface MarkerProps {
  coordinates: [number, number];
  children?: ReactNode;
}
export const Marker: React.FC<MarkerProps>;

export interface ZoomableGroupProps {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
  onMoveStart?: () => void;
  onZoomEnd?: (zoom: number) => void;
  onZoomStart?: () => void;
  translateExtent?: [[number, number], [number, number]];
  children?: ReactNode;
}
export const ZoomableGroup: React.FC<ZoomableGroupProps>;

export interface ComposableWrapperProps {
  width: number;
  height: number;
  projection: string | object;
  style?: React.CSSProperties;
  projectionConfig?: object;
  defs?: ReactNode;
  children?: ReactNode;
}
export const ComposableWrapper: React.FC<ComposableWrapperProps>;

export interface GraticuleProps {
  fill?: string;
  stroke?: string;
  step?: [number, number];
  round?: boolean;
  precision?: number;
  children?: ReactNode;
}
export const Graticule: React.FC<GraticuleProps>;

export interface AnnotationProps {
  subject: [number, number];
  dx?: number;
  dy?: number;
  children?: ReactNode;
}
export const Annotation: React.FC<AnnotationProps>;
