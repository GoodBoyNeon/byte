export type SuggestionStatus = 'Approved' | 'Denied' | 'Under Review';

export type SuggestionStatusField = {
  name: 'Status';
  value: SuggestionStatus;
};
