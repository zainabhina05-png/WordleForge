import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-24">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#000000',
            colorBackground: '#e7e5e4',
            colorText: '#000000',
            colorTextSecondary: '#595855',
            colorInputBackground: '#ebebeb',
            colorInputText: '#000000',
            borderRadius: '9px',
          },
        }}
      />
    </div>
  );
}
