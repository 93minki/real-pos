import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export function useOrderSSE() {
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const connectSSE = async () => {
      try {
        // 이전 연결이 있다면 종료
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await fetch(`${apiUrl}/orders/sse`, {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
          headers: {
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('event: orderAdded')) {
              console.log('Order added event received');
              queryClient.invalidateQueries({ queryKey: ['order-list'] });
            }
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('SSE connection error:', error);
          // 5초 후 재연결 시도
          setTimeout(connectSSE, 5000);
        }
      }
    };

    connectSSE();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [queryClient]);
}

// EventSource를 사용하고 싶다면 이 함수를 사용 (쿠키 문제가 있을 수 있음)
export function useOrderSSEWithEventSource() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const eventSource = new EventSource(`${apiUrl}/orders/sse`, {
      withCredentials: true,
    });

    eventSource.addEventListener('orderAdded', () => {
      console.log('Order added event received via EventSource');
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    });

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
