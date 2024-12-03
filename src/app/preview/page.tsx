'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {PreviewComponent} from '@/components/PreviewComponent';

export default function PreviewPage() {
  const router = useRouter();
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Perform iframe check on the client side
    if (window.self === window.top) {
      router.replace('/'); // Redirect immediately if not in an iframe
    } else {
      setIsEmbedded(true); // Confirm the page is embedded
    }
  }, [router]);

  // Render nothing until the iframe check is complete
  if (!isEmbedded) return null;

  // Render the preview component when the page is embedded
  return <PreviewComponent />;
}
