import { useEffect, useState, useRef, RefObject } from 'react';

export function useInView(options = { threshold: 0.1, rootMargin: '0px' }): {
  ref: RefObject<HTMLDivElement>;
  isInView: boolean;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Once in view, we can stop observing if we only want to trigger once
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, isInView };
}