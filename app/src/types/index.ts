
export type Context = {
    // user: UserExt
}

export type ContextWithDataSources = Context & {
    // dataSources: DataSources
}

export enum CallOrPutType {
  Call = 'CALL',
  Put = 'PUT'
}

export type Instrument = {
  id: string;
  name: string;
};

export type InstrumentDetails = {
  buyPrice?: number;
  change?: number;
  changePercent?: number;
  highestPrice?: number;
  href: string;
  lastPrice?: number;
  lowestPrice?: number;
  name: string;
  sellPrice?: number;
  totalVolumeTraded?: number;
  updated?: string;
};

export type OptionDetails = {
  IV?: number;
  ask?: number;
  bid?: number;
  change?: number | null;
  changePercent?: number;
  delta?: number;
  expires?: string;
  gamma?: number;
  high?: number;
  href?: string;
  interest?: number;
  last?: number;
  low?: number;
  name?: string;
  optionType?: OptionType;
  parity?: number;
  rho?: number;
  spread?: number;
  strike?: number;
  theta?: number;
  type?: CallOrPutType;
  updated?: string;
  vega?: number;
  volume?: number;
};

export type OptionMatrixItem = {
  call?: OptionDetails;
  put?: OptionDetails;
  strike?: number;
};

export enum OptionType {
  Standard = 'STANDARD',
  Weekly = 'WEEKLY'
}

export type OptionsList = {
  options?: OptionMatrixItem[];
  underlying?: InstrumentDetails;
};

export type OptionsMatrix = {
  matrix: OptionsWithExpiry[];
  underlying?: InstrumentDetails;
};

export type OptionsWithExpiry = {
  expires: string;
  options: OptionMatrixItem[];
};

