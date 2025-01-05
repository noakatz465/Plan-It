// דף שמייבא את VerifyCode דינמית
import dynamic from 'next/dynamic';

const VerifyCode = dynamic(() => import('@/app/components/auth/VerifyCode'), {
  ssr: false,
});

function Page() {
  return (
    <div>
      <VerifyCode />
    </div>
  );
}

export default Page;
