import type { Ref } from "vue";

export type QueryValue = string | number | boolean | null | string[];

export interface UseQueryProps {
    preserveScroll?: boolean;
    preserveState?: boolean;
    only?: string[];
    except?: string[];
    lazy?: boolean;
    delimiter?: string;
}

export interface UseQuery {

}