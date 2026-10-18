import Image from "next/image";
import Link from "next/link";
import { brand } from "../../lib/navigation";

// The logo tile beside the live wordmark ("Prompt" + "AtWork" in
// brand-accent). The image is decorative; the wordmark carries the name.
export default function Brand({ size = 36 }: { size?: 30 | 36 }) {
  return (
    <Link href="/" className="paw-brand" aria-label={`${brand.name} home`}>
      <Image
        src={brand.logo}
        alt=""
        width={size}
        height={size}
        className="paw-brand__logo"
        style={{ width: size, height: size, borderRadius: size === 30 ? 8 : 10 }}
        priority
      />
      <span>
        Prompt<span className="paw-brand__accent">AtWork</span>
      </span>
    </Link>
  );
}
