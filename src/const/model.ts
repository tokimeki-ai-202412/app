type ModelData = {
  id: string;
  name: string;
  endpoint: string;
  cost: number;
};

export const modelData: ModelData[] = [
  {
    id: 'first_model_512px',
    name: 'はじまりのモデル',
    endpoint: 'k09ny32a6a311g',
    cost: 0,
  },
  {
    id: 'girls_pose100_1024px',
    name: 'Girls Pose100 (1024px)',
    endpoint: 'fhz6mckqe7vwqc',
    cost: 1,
  },
];
