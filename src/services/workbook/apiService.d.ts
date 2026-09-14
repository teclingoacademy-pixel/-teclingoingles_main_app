// src/services/apiService.d.ts

export interface ApiUserPayload {
  user_id: string;
  email: string;
  nombre: string;
  avatar_url?: string | null;
  fecha_registro?: string;
  nivel_actual?: string;
  xp_total?: number;
  clases_completadas?: number;
  tipo_cuenta?: 'regular' | 'demo';
  [key: string]: unknown;
}

export interface ApiProgressPayload {
  user_id: string;
  clase_id: string;
  habilidad: string;
  reactivo_id: string;
  respuesta_usuario: string;
  correcto: boolean;
  tiempo_respuesta_seg?: number;
  puntaje_obtenido?: number;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: unknown;
}

export declare const apiService: {
  getUser: (userId: string) => Promise<ApiResponse>;
  createUser: (userData: ApiUserPayload) => Promise<ApiResponse>;
  updateUser: (userData: Partial<ApiUserPayload> & { user_id: string }) => Promise<ApiResponse>;
  saveProgress: (progressData: ApiProgressPayload) => Promise<ApiResponse>;
  getTextoBase: (claseId: string) => Promise<ApiResponse>;
};

export default apiService;

