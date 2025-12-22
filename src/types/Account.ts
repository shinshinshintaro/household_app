export type AccountType = 'INCOME' | 'EXPENSE';

export type Account ={
  id?: number;
  type: AccountType;
  category: string;
  amount: number;
  date: string;
  memo?: string;
}