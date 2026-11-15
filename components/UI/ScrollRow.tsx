import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface ScrollRowProps {
  className?: string;
  id?: string;
  hidden?: boolean;
  isDays?: boolean;
  children?: ReactNode;
  deps?: any[];
  scrollRef?: MutableRefObject<HTMLDivElement | null>;
}

// Hàng cuộn ngang (chips / ngày) có nút mũi tên hai đầu + lăn chuột cuộn ngang
export const ScrollRow: React.FC<ScrollRowProps> = ({
  className,
  id,
  hidden,
  isDays,
  children,
  deps = [],
  scrollRef,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [nav, setNav] = useState({ prev: false, next: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const scrollable = !el.hidden && el.scrollWidth > el.clientWidth + 2;
    setNav({
      prev: scrollable && el.scrollLeft > 2,
      next: scrollable && el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    update();
  }, [update, hidden, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (
        el.scrollWidth <= el.clientWidth ||
        Math.abs(e.deltaX) > Math.abs(e.deltaY)
      ) {
        return;
      }
      const before = el.scrollLeft;
      el.scrollLeft += e.deltaY;
      if (el.scrollLeft !== before) e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.max(160, el.clientWidth * 0.7) * dir;
    el.scrollTo({ left: el.scrollLeft + step, behavior: "smooth" });
  };

  return (
    <div className={"chips-wrap" + (isDays ? " days-wrap" : "")}>
      <button
        type="button"
        className="chips-nav prev"
        aria-label="‹"
        hidden={!nav.prev}
        onClick={() => go(-1)}
      >
        <span>‹</span>
      </button>
      <div
        className={className}
        id={id}
        hidden={hidden}
        ref={(el) => {
          ref.current = el;
          if (scrollRef) scrollRef.current = el;
        }}
        onScroll={update}
      >
        {children}
      </div>
      <button
        type="button"
        className="chips-nav next"
        aria-label="›"
        hidden={!nav.next}
        onClick={() => go(1)}
      >
        <span>›</span>
      </button>
    </div>
  );
};

export default ScrollRow;
