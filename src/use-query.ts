import { ref, onMounted } from "vue";
import { router } from "@inertiajs/vue3"
import type { UseQueryProps, QueryValue } from "./types";
import { watchPausable } from "@vueuse/core";

/**
 * What options do I need?
 * 
 * - Use inertia reload
 * - Control of the reload props in Inertia
 * - Whether to do lazy or eager updates via watcher
 * - array delimiter = ','
 */
export const useQuery = (options: UseQueryProps) => {
    const {
        preserveScroll = false,
        preserveState = false,
        only = [],
        except = [],
        lazy = false,
        delimiter = ',',
    } = options;

    const params = ref<Record<string, QueryValue>>({});

    /**
     * Convert the params object to a set of query parameters
     * 
     * @returns Object
     */
    const getQueryParams = () => {
        return Object.fromEntries(Object.entries(params.value).filter(([_, value]) => value !== null));
    }

    /**
     * Retrieve the query parameters from the current URL
     * 
     * @returns Object
     */
    const parseQueryParams = () => {
        const query = new URLSearchParams(window.location.search);
        return Object.fromEntries(query.entries());
    }

    const set = (key: string, value: any) => {
        params.value[key] = value;
    }

    const clear = (key: string) => {
        set(key, null);
    }

    const reset = () => {
        params.value = {};
    }

    const reload = () => {
        router.visit(window.location.pathname, {
            data: getQueryParams(),
            preserveScroll,
            preserveState,
            only,
            except,
        })
    }

    const { pause, resume } = watchPausable(params, reload)

    onMounted(() => {
        pause()
        params.value = parseQueryParams();
        // params.value = 'Hello'
        // lazy && pause();
    })

    return {
        params,
        set,
        clear,
        reset,
        reload,
        pause,
        resume,
    }
}
