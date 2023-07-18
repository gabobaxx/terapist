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
					user_id: string;
					email: string | null;
					customer_id: string;
					is_invited: boolean;
					created_at?: string | null;
				};
				Insert: {
					user_id: string;
					customer_id: string;
					is_invited: boolean;
					email: string | null;
					created_at: string | null;
				};
				Update: {
					user_id?: string;
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
			solicitudes: {
				Row: {
					id: string;
					vaccine_id: string;
					client_id: string; // client of the customer

					date: Date; // fecha de la cita
				};
				Insert: {
					id: string;
					vaccine_id: string;
					client_id: string; // client of the customer

					date: Date; // fecha de la cita
				};
				Update: {
					id?: string;
					vaccine_id?: string;
					client_id?: string; // client of the customer

					date?: Date; // fecha de la cita
				};
			};
			vaccines: {
				Row: {
					id: string;
					name: string | null;
					quantity: number;
					customer_id: string;
				};
				Insert: {
					id: string;
					name?: string | null;
					quantity?: number;
					customer_id?: string;
				};
				Update: {
					id?: string;
					name?: string | null;
					quantity?: number;
					customer_id?: string;
				};
			};
			kids: {
				Row: {
					id: string;
					name: string;
					lastname: string;
					age: number;
					client_id: string;
				};
				Insert: {
					id?: string;
					name?: string;
					lastname?: string;
					age?: number;
					client_id?: string;
				};
				Update: {
					id?: string;
					name?: string;
					lastname?: string;
					age?: number;
					client_id?: string;
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
