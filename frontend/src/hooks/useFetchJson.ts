import {useEffect, useState} from "react";

type FetchJsonState<T> = {
    data: T;
    isLoading: boolean;
    error: Error | null;
};

export function useFetchJson<T>(url: string, initialData: T): FetchJsonState<T> {
    const [data, setData] = useState<T>(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}`);
                }

                const json = (await response.json()) as T;

                if (isMounted) {
                    setData(json);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown fetch error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadData();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return {data, isLoading, error};
}
