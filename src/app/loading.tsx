import { PageLoader } from '@/components/shared/Loader';
import { Color } from '@/components/shared/Loader';

export default function Loading() {
  return <PageLoader text="Loading..." color={Color.DARK} />;
}
