export interface MaterialEstimate {
  size: string;
  // Product Dimensions
  backLength: string;
  chestWidth: string;
  sleeveLength: string;
  // Material Usage
  mainFabric: string;
  liningFabric: string;
  insulation?: string;
  hardware: string;
  notes?: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: MaterialEstimate[] | null;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}