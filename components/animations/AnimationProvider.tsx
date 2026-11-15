import { ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";

interface Props {
  children: ReactNode;
}

export default function AnimationProvider({ children }: Props) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
