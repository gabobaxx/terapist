export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			customers: {
				Row: {
					is_subscribed: boolean;
					stripe_customer_id: string;
					user_id: string;
				};
				Insert: {
					is_subscribed?: boolean;
					stripe_customer_id: string;
					user_id?: string;
				};
				Update: {
					is_subscribed?: boolean;
					stripe_customer_id?: string;
					user_id?: string;
				};
			};
			clients: {
				Row: {
					id: string;
					customer_id: string;
					is_invited: boolean;
					email: string | null;
					created_at: string | null;
				};
				Insert: {
					id: string;
					customer_id: string;
					is_invited: boolean;
					email: string | null;
					created_at: string | null;
				};
				Update: {
					id?: string;
					customer_id?: string;
					is_invited?: boolean;
					email?: string | null;
					created_at?: string | null;
				};
			};
			todos: {
				Row: {
					id: string;
					name: string | null;
					user_id: string;
				};
				Insert: {
					id: string;
					name?: string | null;
					user_id?: string;
				};
				Update: {
					id?: string;
					name?: string | null;
					user_id?: string;
				};
			};
			vaccines: {
				Row: {
					id: string;
					name: string | null;
					quantity: number;
					user_id: string;
				};
				Insert: {
					id: string;
					name?: string | null;
					quantity?: number;
					user_id?: string;
				};
				Update: {
					id?: string;
					name?: string | null;
					quantity?: number;
					user_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
