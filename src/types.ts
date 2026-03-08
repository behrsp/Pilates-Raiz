export interface Exercise {
  id: number;
  nome_en: string;
  nome_pt: string;
  posicao_inicial: string;
  execucao: string;
  respiracao: string;
  repeticoes: string;
  beneficios: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  imagem: string;
}

export interface Principle {
  title: string;
  description: string;
}

export type Screen = 'home' | 'exercises' | 'sequence' | 'library' | 'about';
