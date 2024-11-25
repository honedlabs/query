import { ref, onMounted } from "vue";
import { router } from "@inertiajs/vue3";
import type { UseQueryProps, QueryValue, UseQuery } from "./types";
import { watchPausable } from "@vueuse/core";

export const useQuery = (options: UseQueryProps): UseQuery => {
	const {
		preserveScroll = false,
		preserveState = false,
		only = [],
		except = [],
		eager = true,
		delimiter = ",",
		keys = [],
	} = options;

	/**
	 * Initialize an empty params object, with null values for specified keys
	 */
	const params = ref<Record<string, QueryValue>>(
		Object.fromEntries(keys.map((key) => [key, null])),
	);

	/**
	 * Convert the params object to a set of query parameters
	 *
	 * @returns Record<string, string>
	 */
	const toQueryParams = () => {
		const result: Record<string, string> = {};
		for (const [key, value] of Object.entries(params.value)) {
			if (value !== null && value !== undefined && value !== "") {
				result[key] = Array.isArray(value)
					? value.join(delimiter)
					: String(value);
			}
		}
		return result;
	};

	/**
	 * Retrieve the query parameters from the current URL
	 *
	 * @returns Record<string, QueryValue>
	 */
	const getQueryParams = () =>
		Object.fromEntries(
			Array.from(new URLSearchParams(window.location.search)).map(
				([key, value]) => {
					if (!value.includes(delimiter)) {
						const num = Number(value);
						return [key, !isNaN(num) ? num : value];
					}

					return [
						key,
						value.split(delimiter).map((v) => {
							const num = Number(v);
							return !isNaN(num) ? num : v;
						}),
					];
				},
			),
		);

	/**
	 * Get the value of a specific key
	 */
	const get = (key: keyof typeof params.value) => params.value[key];

	/**
	 * Set the value of a specific key
	 */
	const set = (key: keyof typeof params.value, value: any) => {
		params.value[key] = value;
	};
	/**
	 * Clear the value of a specific key
	 */
	const clear = (key: keyof typeof params.value) => {
		set(key, null);
	};

	/**
	 * Reset the params object to its initial state
	 */
	const reset = () => {
		params.value = Object.fromEntries(keys.map((key) => [key, null]));
	};

	/**
	 * Reload the page with the current query parameters
	 */
	const reload = () => {
		router.visit(window.location.pathname, {
			data: toQueryParams(),
			preserveScroll,
			preserveState,
			only,
			except,
		});
	};

	const { pause, resume } = watchPausable(params, reload);

	onMounted(() => {
		pause();
		params.value = { ...params.value, ...getQueryParams() };
		eager && resume();
	});

	return {
		params,
		get,
		set,
		clear,
		reset,
		reload,
		pause,
		resume,
	};
};
