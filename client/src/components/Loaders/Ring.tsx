import { ring } from "ldrs";

ring.register();

interface RingProps {
  color?: string;
  size?: number;
}

const Ring: React.FC<RingProps> = ({ color = "black", size = 20 }) => {
  return (
    <l-ring
      size={size}
      stroke="3"
      bg-opacity="0"
      speed="2"
      color={color}
    ></l-ring>
  );
};
export default Ring;
