
export enum Tab {
  Editor = 'editor',
  Chat = 'chat',
  Search = 'search',
  Reasoning = 'reasoning',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingSource;
}
