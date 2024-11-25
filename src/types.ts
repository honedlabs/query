import type { Ref } from "vue";
import type { Fn } from "@vueuse/core";

export type QueryValue = string | number | boolean | null | string[] | number[];

export interface UseQueryProps {
	preserveScroll?: boolean;
	preserveState?: boolean;
	only?: string[];
	except?: string[];
	eager?: boolean;
	delimiter?: string;
	keys?: string[];
}

export interface UseQuery {
	params: Ref<Record<string, QueryValue>>;
	get: (key: string) => QueryValue;
	set: (key: string, value: QueryValue) => void;
	clear: (key: string) => void;
	reset: Fn;
	reload: Fn;
	pause: Fn;
	resume: Fn;
}
